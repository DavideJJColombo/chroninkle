#include "auto_classify.h"

#include <cctype>
#include <cstdlib>

#include "cJSON.h"

namespace auto_classify {
namespace {

std::string Trim(const std::string& text)
{
    const size_t begin = text.find_first_not_of(" \t\r\n");
    if (begin == std::string::npos) {
        return {};
    }
    const size_t end = text.find_last_not_of(" \t\r\n");
    return text.substr(begin, end - begin + 1);
}

std::string StringField(const cJSON* object, const char* key)
{
    const cJSON* item = cJSON_GetObjectItemCaseSensitive(object, key);
    return cJSON_IsString(item) && item->valuestring != nullptr ? Trim(item->valuestring)
                                                                : std::string();
}

bool AllDigits(const std::string& text, size_t begin, size_t count)
{
    for (size_t i = begin; i < begin + count; ++i) {
        if (!std::isdigit(static_cast<unsigned char>(text[i]))) {
            return false;
        }
    }
    return true;
}

// Gemini sometimes wraps JSON in a ```json fence even in JSON mode; strip it.
std::string StripCodeFence(const std::string& text)
{
    std::string trimmed = Trim(text);
    if (trimmed.rfind("```", 0) != 0) {
        return trimmed;
    }
    const size_t first_newline = trimmed.find('\n');
    const size_t last_fence = trimmed.rfind("```");
    if (first_newline == std::string::npos || last_fence <= first_newline) {
        return trimmed;
    }
    return Trim(trimmed.substr(first_newline + 1, last_fence - first_newline - 1));
}

}  // namespace

bool IsValidDate(const std::string& value)
{
    if (value.size() != 10 || value[4] != '-' || value[7] != '-' || !AllDigits(value, 0, 4) ||
        !AllDigits(value, 5, 2) || !AllDigits(value, 8, 2)) {
        return false;
    }
    const int month = std::atoi(value.substr(5, 2).c_str());
    const int day = std::atoi(value.substr(8, 2).c_str());
    return month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

bool IsValidTime(const std::string& value)
{
    if (value.size() != 5 || value[2] != ':' || !AllDigits(value, 0, 2) || !AllDigits(value, 3, 2)) {
        return false;
    }
    return std::atoi(value.substr(0, 2).c_str()) <= 23 && std::atoi(value.substr(3, 2).c_str()) <= 59;
}

const char* ResponseSchemaJson()
{
    return R"({"type":"OBJECT","properties":{)"
           R"("transcript":{"type":"STRING"},)"
           R"("type":{"type":"STRING","enum":["note","idea","task","new_topic"]},)"
           R"("topic":{"type":"STRING"},)"
           R"("tasks":{"type":"ARRAY","items":{"type":"OBJECT","properties":{)"
           R"("text":{"type":"STRING"},"due_date":{"type":"STRING"},"due_time":{"type":"STRING"}},)"
           R"("required":["text"]}}},)"
           R"("required":["transcript","type"],)"
           R"("propertyOrdering":["transcript","type","topic","tasks"]})";
}

std::string BuildPrompt(const PromptContext& context)
{
    std::string prompt =
        "You receive a short voice memo recorded on a pocket notebook device. Transcribe it and "
        "classify it. Reply with JSON only, matching the schema.\n\n"
        "- transcript: a verbatim transcript of the speech, in the language actually spoken "
        "(never translate). No commentary.\n";
    if (context.italian) {
        prompt +=
            "  The speaker most likely speaks Italian: write Italian with correct accents, "
            "apostrophes and punctuation.\n";
    }
    prompt +=
        "- type: \"task\" if the speaker says one or more things to do (an action, an errand, a "
        "reminder, something to buy, call, pay, send...); \"idea\" for an idea, a proposal or a "
        "creative thought; \"new_topic\" ONLY if the speaker explicitly asks to create a new "
        "topic or project (e.g. \"new topic kitchen renovation\", \"nuovo argomento cucina\"); "
        "otherwise \"note\".\n"
        "- topic: for new_topic, the name of the topic to create (at most 4 words, only words "
        "that were said). Otherwise the existing topic the memo clearly belongs to, copied "
        "exactly from the list below; empty if none clearly fits.\n"
        "- tasks: for type task, one item per distinct thing to do, in the order said. text is "
        "a short imperative phrase in the speaker's language (e.g. \"Comprare il latte\", "
        "\"Call Marco\"), keeping names and details. due_date is YYYY-MM-DD when a day is said "
        "(resolve relative days such as \"domani\", \"venerdì\", \"tomorrow\", \"next Monday\" "
        "against today), otherwise empty. due_time is HH:MM (24-hour) when a time is said, "
        "otherwise empty. For other types, an empty list.\n\n";
    if (context.time_valid) {
        prompt += "Today is " + context.today_weekday + " " + context.today_date + ", local time " +
                  context.now_time + ".\n";
    } else {
        prompt += "Today's date is unknown: fill due_date only for fully explicit dates.\n";
    }
    if (context.topic_names.empty()) {
        prompt += "Existing topics: none.\n";
    } else {
        prompt += "Existing topics:\n";
        for (const std::string& name : context.topic_names) {
            prompt += "- " + name + "\n";
        }
    }
    return prompt;
}

Result Parse(const std::string& text)
{
    Result result = {};
    const std::string json = StripCodeFence(text);
    cJSON* root = cJSON_ParseWithLength(json.c_str(), json.size());
    if (root == nullptr || !cJSON_IsObject(root)) {
        if (root != nullptr) {
            cJSON_Delete(root);
        }
        result.transcript = Trim(text);  // plain text answer: keep it as the transcript
        return result;
    }

    result.parsed = true;
    result.transcript = StringField(root, "transcript");
    result.topic = StringField(root, "topic");
    const std::string type = StringField(root, "type");

    const cJSON* tasks = cJSON_GetObjectItemCaseSensitive(root, "tasks");
    if (cJSON_IsArray(tasks)) {
        const cJSON* item = nullptr;
        cJSON_ArrayForEach(item, tasks)
        {
            Task task = {};
            task.text = StringField(item, "text");
            if (task.text.empty()) {
                continue;
            }
            const std::string due_date = StringField(item, "due_date");
            const std::string due_time = StringField(item, "due_time");
            task.due_date = IsValidDate(due_date) ? due_date : std::string();
            // A time without a day is meaningless on its own here.
            task.due_time = !task.due_date.empty() && IsValidTime(due_time) ? due_time
                                                                             : std::string();
            result.tasks.push_back(std::move(task));
        }
    }
    cJSON_Delete(root);

    if (type == "task") {
        result.kind = Kind::kTask;
        if (result.tasks.empty() && !result.transcript.empty()) {
            result.tasks.push_back({.text = result.transcript});
        }
    } else if (type == "idea") {
        result.kind = Kind::kIdea;
    } else if (type == "new_topic" && !result.topic.empty()) {
        result.kind = Kind::kNewTopic;
    } else {
        result.kind = Kind::kNote;
    }
    if (result.kind != Kind::kTask) {
        result.tasks.clear();
    }
    if (result.kind == Kind::kTask && result.tasks.empty()) {
        result.kind = Kind::kNote;  // nothing usable to file as a task
    }
    return result;
}

}  // namespace auto_classify

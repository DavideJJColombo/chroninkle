#ifndef RECORDING_SESSION_AUTO_CLASSIFY_H_
#define RECORDING_SESSION_AUTO_CLASSIFY_H_

#include <string>
#include <vector>

// Automatic classification of a new recording, done by Gemini in the same call as the
// transcription: the prompt and JSON schema sent with the audio, and the parsing of the answer.
// No ESP-IDF dependencies (only cJSON), so it is covered by the host tests in tests/host.
namespace auto_classify {

struct Task {
    std::string text = {};
    std::string due_date = {};  // "YYYY-MM-DD" or empty
    std::string due_time = {};  // "HH:MM" or empty
};

enum class Kind {
    kNote,
    kIdea,
    kTask,
    kNewTopic,  // the speaker asked to create a topic; `topic` is its name
};

struct Result {
    bool parsed = false;  // false: the answer was not the expected JSON (transcript = raw text)
    std::string transcript = {};
    Kind kind = Kind::kNote;
    std::string topic = {};      // an existing topic name, or the new topic for kNewTopic
    std::vector<Task> tasks = {};  // kTask only; at least one when kind is kTask
};

struct PromptContext {
    bool italian = false;
    bool time_valid = false;
    std::string today_date = {};     // "YYYY-MM-DD"
    std::string today_weekday = {};  // English name, e.g. "Thursday"
    std::string now_time = {};       // "HH:MM"
    std::vector<std::string> topic_names = {};
};

std::string BuildPrompt(const PromptContext& context);
const char* ResponseSchemaJson();
Result Parse(const std::string& text);

bool IsValidDate(const std::string& value);
bool IsValidTime(const std::string& value);

}  // namespace auto_classify

#endif  // RECORDING_SESSION_AUTO_CLASSIFY_H_

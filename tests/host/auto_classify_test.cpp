// Host-side (PC) tests for the automatic classification of recordings: parsing Gemini's JSON
// answer and building the prompt. Run with tests/host/run.sh (needs cJSON, see run.sh).
#include <cstdio>
#include <string>

#include "auto_classify.h"
#include "cJSON.h"

using auto_classify::Kind;
using auto_classify::Parse;

static int failures = 0;
#define CHECK(cond)                                                                 \
    do {                                                                            \
        if (!(cond)) {                                                              \
            std::fprintf(stderr, "FAIL %s:%d %s\n", __FILE__, __LINE__, #cond);     \
            ++failures;                                                             \
        }                                                                           \
    } while (0)

int main()
{
    // Several todos with deadlines; a time without a date is dropped, a bad date too.
    {
        const auto r = Parse(R"({"transcript":"Domani devo comprare il latte, chiamare Marco entro venerdì alle 15 e pagare la bolletta","type":"task","topic":"Casa","tasks":[{"text":"Comprare il latte","due_date":"2026-11-13","due_time":""},{"text":"Chiamare Marco","due_date":"2026-11-14","due_time":"15:00"},{"text":"Pagare la bolletta","due_date":"","due_time":"09:00"},{"text":"  ","due_date":"2026-13-40"}]})");
        CHECK(r.parsed);
        CHECK(r.kind == Kind::kTask);
        CHECK(r.topic == "Casa");
        CHECK(r.tasks.size() == 3);
        CHECK(r.tasks[0].text == "Comprare il latte" && r.tasks[0].due_date == "2026-11-13");
        CHECK(r.tasks[1].due_time == "15:00");
        CHECK(r.tasks[2].due_date.empty() && r.tasks[2].due_time.empty());
    }
    // A task with no task list becomes a single task with the transcript.
    {
        const auto r = Parse(R"({"transcript":"Ricordati di innaffiare le piante","type":"task"})");
        CHECK(r.kind == Kind::kTask && r.tasks.size() == 1);
        CHECK(r.tasks[0].text == "Ricordati di innaffiare le piante");
    }
    // Ideas and notes carry no tasks even if the model added some.
    {
        const auto r = Parse(R"({"transcript":"E se facessimo un'app?","type":"idea","tasks":[{"text":"x"}]})");
        CHECK(r.kind == Kind::kIdea && r.tasks.empty());
        const auto n = Parse(R"({"transcript":"Oggi è stata una bella giornata","type":"note","topic":""})");
        CHECK(n.kind == Kind::kNote && n.topic.empty());
    }
    // New topic needs a name; without one it falls back to a note.
    {
        const auto t = Parse(R"({"transcript":"Nuovo argomento ristrutturazione cucina","type":"new_topic","topic":"Ristrutturazione cucina"})");
        CHECK(t.kind == Kind::kNewTopic && t.topic == "Ristrutturazione cucina");
        const auto f = Parse(R"({"transcript":"Nuovo argomento","type":"new_topic","topic":""})");
        CHECK(f.kind == Kind::kNote);
    }
    // Code fences are tolerated; plain text falls back to being the transcript.
    {
        const auto r = Parse("```json\n{\"transcript\":\"ciao\",\"type\":\"note\"}\n```");
        CHECK(r.parsed && r.transcript == "ciao");
        const auto p = Parse("  just some text  ");
        CHECK(!p.parsed && p.transcript == "just some text" && p.kind == Kind::kNote);
    }
    // Validators.
    CHECK(auto_classify::IsValidDate("2026-02-28"));
    CHECK(!auto_classify::IsValidDate("2026-2-28"));
    CHECK(!auto_classify::IsValidDate("26-02-2026"));
    CHECK(auto_classify::IsValidTime("09:05"));
    CHECK(!auto_classify::IsValidTime("24:00"));
    // The schema is valid JSON; the prompt carries today's date and the topics.
    {
        cJSON* schema = cJSON_Parse(auto_classify::ResponseSchemaJson());
        CHECK(schema != nullptr);
        cJSON_Delete(schema);
        auto_classify::PromptContext context = {};
        context.italian = true;
        context.time_valid = true;
        context.today_date = "2026-11-12";
        context.today_weekday = "Thursday";
        context.now_time = "21:30";
        context.topic_names = {"Casa", "Lavoro"};
        const std::string prompt = auto_classify::BuildPrompt(context);
        CHECK(prompt.find("Thursday 2026-11-12") != std::string::npos);
        CHECK(prompt.find("- Lavoro") != std::string::npos);
        CHECK(prompt.find("Italian") != std::string::npos);
    }

    std::printf(failures == 0 ? "ALL CHECKS PASSED (auto_classify)\n" : "%d CHECKS FAILED\n",
                failures);
    return failures == 0 ? 0 : 1;
}

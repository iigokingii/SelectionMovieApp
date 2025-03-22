package org.example.quizservice.Initializer;

import org.example.quizservice.Model.Answer;
import org.example.quizservice.Model.Question;
import org.example.quizservice.Repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class QuizDataInitializer {

    private final QuestionRepository questionRepository;

    public QuizDataInitializer(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Bean
    public CommandLineRunner initQuizzes() {
        return args -> {
            if (questionRepository.count() == 0) {
                List<Question> questions = new ArrayList<>();

                questions.add(createQuestion("Какой жанр фильмов вам больше всего нравится?",
                        "Фантастика", "Драма", "Комедия", "Боевик", "Ужасы"));

                questions.add(createQuestion("Какие фильмы вам нравятся больше?",
                        "Современные", "Классика", "Чёрно-белые", "Артхаус", "Анимация"));

                questions.add(createQuestion("Какое настроение у вас чаще всего, когда выбираете фильм?",
                        "Весёлое – хочется комедии", "Грустное – нужна драма", "Адреналин – выбираю боевик",
                        "Любопытство – документальные", "Романтичное – мелодрамы"));

                questions.add(createQuestion("Как вы относитесь к фантастическим фильмам?",
                        "Обожаю, особенно про космос", "Люблю, но только научную фантастику",
                        "Сказки для детей, не люблю", "Завиcит от сюжета"));

                questions.add(createQuestion("Какие фильмы про супергероев вам нравятся?",
                        "Marvel", "DC", "Независимые фильмы про героев", "Не люблю супергеройское кино"));

                questions.add(createQuestion("Как вы относитесь к романтическим фильмам?",
                        "Люблю смотреть, особенно классические", "Хороши, если не слишком сладкие",
                        "Скучные и предсказуемые", "Только если есть что-то необычное в сюжете"));

                questions.add(createQuestion("Любите ли вы фильмы ужасов?",
                        "Да, особенно про привидений", "Люблю, если не слишком кровавые",
                        "Обожаю слэшеры", "Не люблю хорроры"));

                questions.add(createQuestion("Как часто вы смотрите комедии?",
                        "Каждый день", "Раз в неделю", "Редко", "Практически никогда"));

                questions.add(createQuestion("Какие фильмы вам нравятся больше?",
                        "Голливудские блокбастеры", "Независимое кино", "Европейские фильмы", "Азиатское кино"));

                questions.add(createQuestion("Какой ваш любимый тип боевика?",
                        "Шпионские фильмы", "Военные фильмы", "Криминальные триллеры", "Фильмы про борьбу за выживание"));

                questions.add(createQuestion("Любите ли вы смотреть фильмы по комиксам?",
                        "Да, обожаю", "Иногда, если интересный сюжет", "Нет, слишком детские", "Не против, если качественно снято"));

                questions.add(createQuestion("Как вы относитесь к документальному кино?",
                        "Люблю, если оно про природу", "Интересуют только научные фильмы",
                        "Смотрю про знаменитостей", "Документалки — не для меня"));

                questions.add(createQuestion("Какой ваш любимый фильм о путешествиях?",
                        "Евротур", "В диких условиях", "Ешь, молись, люби", "Побег из Шоушенка"));

                questions.add(createQuestion("Какой ваш любимый актер?",
                        "Леонардо ДиКаприо", "Том Круз", "Джонни Депп", "Киану Ривз"));

                questions.add(createQuestion("Какая ваша любимая актриса?",
                        "Скарлетт Йоханссон", "Эмма Стоун", "Анжелина Джоли", "Марго Робби"));

                questions.add(createQuestion("Какой тип фильма вы предпочитаете смотреть в вечернее время?",
                        "Легкие комедии", "Драмеди (драма с элементами комедии)", "Триллеры", "Документальные фильмы", "Желательно что-то спокойное и расслабляющее"));

                questions.add(createQuestion("Какой период времени для вас предпочтительнее в фильмах?",
                        "Будущее (научная фантастика, киберпанк)", "Прошлое (исторические фильмы)", "Современность", "Далекое прошлое (например, средневековье)", "Не имеет значения, главное сюжет"));

                questions.add(createQuestion("Какие фильмы вам нравятся больше?",
                        "Фильмы с эпическими битвами и масштабными сценами", "Малобюджетные фильмы, но с сильным сюжетом", "Драмеди с неожиданным концом", "Фильмы с глубоким философским смыслом"));

                questions.add(createQuestion("Какие герои вам ближе?",
                        "Супергерои, спасающие мир", "Простые люди с большими проблемами", "Герои с необычными способностями", "Вымышленные персонажи из мифов и легенд"));

                questions.add(createQuestion("Какой ваш любимый тип отношений в фильмах?",
                        "Романтические истории", "Дружеские отношения и их развитие", "Конфликты и антагонизм между героями", "Командная работа, где все работают на общее благо"));

                questions.add(createQuestion("Какую атмосферу фильма вы предпочитаете?",
                        "Тёмные, мрачные и загадочные", "Яркие, наполненные позитивом и светом", "Необычные, магические и мистические", "Реалистичные, приближенные к настоящей жизни"));

                questions.add(createQuestion("Как вы относитесь к фильмам с неожиданными поворотами сюжета?",
                        "Люблю, когда конец неожидан", "Предпочитаю, чтобы всё было предсказуемо", "Не против, если сюжет действительно захватывает", "Только если это не повседневная драма"));

                questions.add(createQuestion("Как вы относитесь к экранизациям книг?",
                        "Обожаю, особенно если они делают фильм более интересным", "Не всегда согласен с интерпретацией", "Люблю, если книга была хороша", "Не люблю экранизации, предпочитаю оригинальные сценарии"));

                questions.add(createQuestion("Что для вас важнее в фильме?",
                        "Сильный сюжет", "Хорошие актёры", "Красивые визуальные эффекты", "Глубокий смысл или философская составляющая"));

                questions.add(createQuestion("Как вы относитесь к фильмам с элементами фэнтези?",
                        "Очень люблю, магия и мифические существа — это круто", "Иногда смотрю, если сюжет интересный", "Не люблю, это слишком выдумано", "Люблю, но только в контексте исторических событий"));

                questions.add(createQuestion("Какой фильм из списка вам больше нравится?",
                        "Матрица", "Пианист", "Побег из Шоушенка", "Назад в будущее"));

                questions.add(createQuestion("Вы предпочитаете фильмы с субтитрами или без?",
                        "Без субтитров, только на родном языке", "Субтитры — это не проблема", "Люблю смотреть фильмы на оригинальном языке, даже если это сложно", "В зависимости от языка фильма"));

                questions.add(createQuestion("Какую тематику фильмов вы больше всего избегаете?",
                        "Жестокие или кровавые сцены", "Фильмы о животных", "Фильмы, которые основаны на реальных событиях", "Я не избегаю, всегда открыто к новому"));

                questions.add(createQuestion("Какую страну или регион вы бы хотели увидеть в фильме?",
                        "Япония, с её уникальной культурой и историей", "Скандинавия, с её суровой природой и мифами", "Франция, с романтикой и атмосферой", "США, с их масштабными блокбастерами"));

                questions.add(createQuestion("Как часто вы предпочитаете смотреть продолжения фильмов?",
                        "Только если первый фильм был хорош", "Мне не важно, люблю как продолжения, так и оригиналы", "Предпочитаю смотреть новые оригинальные истории", "Продолжения часто разочаровывают, лучше смотреть что-то новое"));

                questions.add(createQuestion("Как вы относитесь к фильмам с альтернативной историей?",
                        "Очень интересно, такие фильмы часто поднимают неожиданные вопросы", "Иногда интересно, если правильно подобран сюжет", "Не люблю, если история слишком отклоняется от реальности", "Я против изменения реальной истории в фильмах"));

                questions.add(createQuestion("Какой фильм вы бы порекомендовали другу для хорошего вечера?",
                        "Интерстеллар", "Форрест Гамп", "Криминальное чтиво", "Титаник"));

                questions.add(createQuestion("Какой стиль музыки вы предпочитаете в фильмах?",
                        "Классическая музыка и оркестровые композиции", "Современные поп-песни", "Инструментальная музыка", "Рок и электронная музыка"));

                questions.add(createQuestion("Какую тему вы предпочитаете в фильмах?",
                        "Семейные ценности и отношения", "Социальные проблемы и конфликты", "Экологические проблемы", "Магия и приключения"));

                questions.add(createQuestion("Как вы относитесь к фильмам с элементами сюрреализма?",
                        "Очень люблю, такие фильмы всегда необычные", "Иногда нравится, если сюжет интересный", "Не люблю, это слишком странно", "Предпочитаю более реалистичные фильмы"));

                questions.add(createQuestion("Какой фильм вам был бы интересен в первый раз?",
                        "Триллер с загадочным сюжетом", "Документальный фильм о животных или природе", "Комедия с элементами экшн", "Глубокая драма с сильными эмоциями"));

                questions.add(createQuestion("Какой элемент в фильмах для вас самый важный?",
                        "Эмоциональная глубина", "Необычные спецэффекты", "Захватывающий сюжет", "Качественная актерская игра"));

                questions.add(createQuestion("Какие фильмы вы предпочитаете смотреть с друзьями?",
                        "Комедии и пародии", "Экшн и боевики", "Триллеры и ужасы", "Драмы с сильным посылом"));

                questions.add(createQuestion("Как вы относитесь к фильмам, основанным на реальных событиях?",
                        "Люблю, когда фильм основан на реальной истории", "Иногда это интересно, если это хорошо сделано", "Мне не нравится, когда фильм слишком буквально передает реальность", "Предпочитаю вымышленные истории"));

                questions.add(createQuestion("Какую страну вы бы выбрали для фильма?",
                        "Индия, с её яркими красками и музыкальными элементами", "Россия, с её мистической атмосферой и историческими темами", "Великобритания, с её строгой атмосферой и необычным юмором", "Германия, с её точным подходом к сюжету"));

                questions.add(createQuestion("Какую возрастную категорию фильмов вы предпочитаете?",
                        "Фильмы для детей и подростков", "Фильмы для взрослых с глубокими сюжетами", "Ничего не меняет, главное – качество фильма", "Предпочитаю смешанные жанры, для всей семьи"));

                questions.add(createQuestion("Что для вас важнее в фильме?",
                        "Глубокие философские размышления", "Захватывающие сцены экшн", "Яркие визуальные эффекты", "Тонкая психологическая игра персонажей"));

                questions.add(createQuestion("Как вы относитесь к фильмам, в которых не используется диалог?",
                        "Очень люблю, такие фильмы часто передают глубокие чувства", "Не против, если фильм интересный", "Трудно воспринимать без слов, предпочитаю с диалогами", "Не люблю, хочу больше общения между персонажами"));

                questions.add(createQuestion("Какой формат просмотра фильма вам предпочтительней?",
                        "В кинотеатре на большом экране", "Дома, на телевизоре", "На планшете или телефоне, в дороге", "На экране проектора для более домашней атмосферы"));

                questions.add(createQuestion("Как вы относитесь к фильмам с моральными дилеммами?",
                        "Очень люблю, когда персонажи сталкиваются с выбором", "Иногда это интересно, если это влияет на сюжет", "Не люблю, когда фильм слишком моралистичен", "Предпочитаю фильмы, где мораль не так очевидна"));

                questions.add(createQuestion("Какой тип фильмов вы предпочитаете для просмотра на отпуске?",
                        "Легкие комедии, чтобы расслабиться", "Триллеры и приключения", "Фильмы с сильным историческим подтекстом", "Романтические мелодрамы"));

                questions.add(createQuestion("Какие особенности фильма для вас наиболее важны?",
                        "Интересный и уникальный сюжет", "Красивые визуальные эффекты", "Глубокие, запоминающиеся персонажи", "Моральная или философская глубина"));

                questions.add(createQuestion("Что вам более привлекательно в фильме?",
                        "Ожидаемые развязки и хеппи-энд", "Неожиданные повороты и концовки", "Реалистичные, приближенные к жизни события", "Магические или фантастические элементы"));

                questions.add(createQuestion("Какой тип фильма вы предпочитаете для просмотра с семьей?",
                        "Мультфильмы и анимационные фильмы", "Семейные драмы и комедии", "Приключенческие фильмы", "Фильмы о животных"));

                questions.add(createQuestion("Какие фильмы вас больше всего впечатляют?",
                        "Фильмы с философским подтекстом", "Исторические и биографические фильмы", "Научная фантастика с глубоким сюжетом", "Масштабные экшн-фильмы с яркими спецэффектами"));

                questions.add(createQuestion("Какую главную роль в фильме вы считаете самой важной?",
                        "Харизматичный главный герой", "Сильный антагонист", "Интересные второстепенные персонажи", "Динамика между всеми персонажами"));

                questions.add(createQuestion("Как вы относитесь к фильмам, где сюжет медленно развивается?",
                        "Люблю, когда фильм погружает в атмосферу постепенно", "Иногда это интересно, если сюжет захватывает", "Мне не нравится, когда действия идут слишком медленно", "Предпочитаю фильмы с быстрым темпом действий"));

                questions.add(createQuestion("Как вы относитесь к фильмам с неожиданными концовками?",
                        "Очень люблю, когда концовка меня удивляет", "Иногда это интересно, если это логично", "Предпочитаю, чтобы всё было предсказуемо", "Не люблю, когда концовка резко меняет смысл фильма"));

                questions.add(createQuestion("Какой подход к съемке фильма вам более близок?",
                        "Реалистичные съемки, как в документальном кино", "Яркие и красочные, как в фильмах для широкой аудитории", "Творческие и экспериментальные методы съемки", "Технологичные съемки с использованием CGI и спецэффектов"));

                questions.add(createQuestion("Какой стиль монтажа вы предпочитаете?",
                        "Долгие кадры, минимальные резкие переходы", "Энергичные и динамичные монтажи", "Медленные сцены, где всё показывается детально", "Тематические переходы, которые создают атмосферу"));

                questions.add(createQuestion("Как вы относитесь к фильмам с жестокой сценой насилия?",
                        "Не против, если это важно для сюжета", "Предпочитаю избегать таких сцен", "Я вообще не люблю насилие в фильмах", "Не возражаю, если это не слишком графично"));

                questions.add(createQuestion("Как вы относитесь к фильмам с долгими сценами без диалогов?",
                        "Очень люблю, они могут быть очень выразительными", "Иногда это работает, если сцена очень важна", "Не люблю, когда слишком много пауз и тишины", "Мне это не нравится, люблю, когда есть диалоги"));

                questions.add(createQuestion("Какую атмосферу в фильмах вы больше всего цените?",
                        "Тёмную и мрачную, с элементами ужаса", "Светлую и жизнеутверждающую", "Тихую и спокойную", "Драматичную с высоким эмоциональным напряжением"));

                questions.add(createQuestion("Что для вас важнее — историческая точность или развлекательный элемент в фильмах?",
                        "Для меня важна историческая точность", "Я предпочитаю развлекательные элементы, даже если это отходит от истории", "Я не могу выбрать, это зависит от контекста фильма", "Мне важна и точность, и увлекательность"));

                questions.add(createQuestion("Какие фильмы вы предпочитаете смотреть в плохую погоду?",
                        "Романтические мелодрамы", "Драмы с глубоким смыслом", "Детективы или триллеры", "Комедии, чтобы развеять грусть"));

                questions.add(createQuestion("Какую тему вы бы выбрали для документального фильма?",
                        "Природные катастрофы и выживание", "Знаменитости и их личная жизнь", "Необычные истории из жизни людей", "Космос и жизнь на других планетах"));

                questions.add(createQuestion("Какие фильмы вас могут заставить переживать за персонажей?",
                        "Глубокие драмы, где герои сталкиваются с реальными проблемами", "Приключенческие фильмы с героями, рискующими жизнью", "Триллеры и фильмы с напряжённым сюжетом", "Фильмы с сильным эмоциональным развитием персонажей"));

                questions.add(createQuestion("Какие фильмы вы предпочитаете для расслабления?",
                        "Легкие комедии", "Мелодрамы с позитивным концом", "Фильмы с элементами фэнтези", "Тихие драмы или артхаусное кино"));

                questions.add(createQuestion("Какую тему вы бы выбрали для экшн-фильма?",
                        "Спасение мира от катастрофы", "Преступность и борьба с мафией", "Шпионские интриги и секретные миссии", "Выживание в экстремальных условиях"));

                questions.add(createQuestion("Как вы относитесь к фильмам, которые заставляют задуматься о жизни?",
                        "Очень люблю, когда фильм затрагивает философские темы", "Иногда это интересно, если фильм не слишком сложен", "Не люблю фильмы, которые заставляют думать", "Мне это важно, если это делается в правильном контексте"));

                questions.add(createQuestion("Какой жанр вам менее всего интересен?",
                        "Мелодрамы", "Классические вестерны", "Мюзиклы", "Мистические ужасы"));

                questions.add(createQuestion("Как вы относитесь к фильму, который мог бы вас напугать?",
                        "Люблю такие фильмы, когда они напряженные", "Не люблю, предпочитаю спокойные фильмы", "Иногда это интересно, если это сделано хорошо", "Не люблю, когда меня пугают фильмы"));

                Save(questions);

                System.out.println("Вопросы для рекомендаций фильмов успешно добавлены в базу данных.");
            }
        };
    }

    private Question createQuestion(String text, String... answers) {
        Question question = new Question();
        question.setText(text);
        List<Answer> answerList = new ArrayList<>();
        for (String answer : answers) {
            answerList.add(Answer.builder().text(answer).build());
        }
        question.setAnswers(answerList);
        return question;
    }

    private void Save (List<Question> questions){
        questionRepository.saveAll(questions);
    }
}

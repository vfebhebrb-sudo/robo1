/* =========================================
   LOAD EXAMS
========================================= */

async function loadExams() {

    try {

        const box =
            document.getElementById("exams");


        if (!box) {

            console.error(
                "EXAMS CONTAINER NOT FOUND"
            );

            return;

        }


        /* =========================================
           LOADING
        ========================================= */

        box.innerHTML = `

            <div
                class="empty"
                id="examsLoading"
            >

                در حال دریافت آزمون‌ها...

            </div>

        `;


        /* =========================================
           API REQUEST
        ========================================= */

        const response = await fetch(
            `${API_URL}/admin/results/exams`
        );


        if (!response.ok) {

            throw new Error(
                `HTTP ERROR: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "ADMIN EXAMS:",
            data
        );


        /* =========================================
           CHECK DATA
        ========================================= */

        if (
            !data ||
            !Array.isArray(data.exams) ||
            data.exams.length === 0
        ) {

            box.innerHTML = `

                <div
                    class="empty"
                    id="examsEmpty"
                >

                    هنوز آزمونی ثبت نشده است

                </div>

            `;

            return;

        }


        /* =========================================
           CLEAR
        ========================================= */

        box.innerHTML = "";


        /* =========================================
           CREATE EXAMS
        ========================================= */

        data.exams.forEach(
            (exam, index) => {


                /* =================================
                   CARD
                ================================= */

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "exam-card";


                card.id =
                    `exam-card-${exam.examId}`;


                card.dataset.examId =
                    exam.examId;


                card.dataset.index =
                    index;



                /* =================================
                   ICON
                ================================= */

                const icon =
                    document.createElement(
                        "div"
                    );


                icon.className =
                    "exam-card-icon";


                icon.innerHTML = `

                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="0.5" class="w-12 h-12 text-neutral-30 mx-auto mb-3"><path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 10H18C15 10 14 9 14 6V2L22 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 13H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 17H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>

                `;



                /* =================================
                   CONTENT
                ================================= */

                const content =
                    document.createElement(
                        "div"
                    );


                content.className =
                    "exam-card-content";



                /* =================================
                   TOP
                ================================= */

                const top =
                    document.createElement(
                        "div"
                    );


                top.className =
                    "exam-card-top";



                /* ---------- TITLE ---------- */

                const title =
                    document.createElement(
                        "div"
                    );


                title.className =
                    "exam-title";


                title.textContent =
                    exam.title ||
                    "بدون عنوان";



                /* ---------- STATUS ---------- */

                const status =
                    document.createElement(
                        "span"
                    );


                status.className =
                    "exam-status";


                status.textContent =
                    "برگزار شده";


                top.appendChild(
                    title
                );


                top.appendChild(
                    status
                );



                /* =================================
                   META
                ================================= */

                const meta =
                    document.createElement(
                        "div"
                    );


                meta.className =
                    "exam-card-meta";



                /* ---------- SUBJECT ---------- */

                meta.appendChild(
                    createExamMeta(
                        "book-open",
                        exam.subject ||
                        "نامشخص"
                    )
                );



                /* ---------- DURATION ---------- */

                meta.appendChild(
                    createExamMeta(
                        "clock-3",
                        exam.duration != null
                            ? `${exam.duration} دقیقه`
                            : "نامشخص"
                    )
                );



                /* ---------- PARTICIPANTS ---------- */

                meta.appendChild(
                    createExamMeta(
                        "users",
                        exam.participants != null
                            ? `${exam.participants} نفر`
                            : "0 نفر"
                    )
                );



                /* ---------- QUESTIONS ---------- */

                meta.appendChild(
                    createExamMeta(
                        "list",
                        exam.questionCount != null
                            ? `${exam.questionCount} سوال`
                            : "نامشخص"
                    )
                );



                /* =================================
                   BUILD CONTENT
                ================================= */

                content.appendChild(
                    top
                );


                content.appendChild(
                    meta
                );



                /* =================================
                   ARROW
                ================================= */

                const arrow =
                    document.createElement(
                        "button"
                    );


                arrow.className =
                    "exam-arrow";


                arrow.type =
                    "button";


                arrow.id =
                    `exam-open-${exam.examId}`;


                arrow.setAttribute(
                    "aria-label",
                    "مشاهده شرکت‌کنندگان"
                );


                arrow.innerHTML = `

                    <i
                        data-lucide="chevron-left"
                    ></i>

                `;



                /* =================================
                   ARROW CLICK
                ================================= */

                arrow.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();

                        openExam(
                            exam.examId
                        );

                    }
                );



                /* =================================
                   CARD CLICK
                ================================= */

                card.addEventListener(
                    "click",
                    function() {

                        openExam(
                            exam.examId
                        );

                    }
                );



                /* =================================
                   ASSEMBLE
                ================================= */

                card.appendChild(
                    icon
                );


                card.appendChild(
                    content
                );


                card.appendChild(
                    arrow
                );


                box.appendChild(
                    card
                );

            }
        );



        /* =========================================
           LUCIDE
        ========================================= */

        if (
            typeof lucide !==
            "undefined"
        ) {

            lucide.createIcons();

        }


        /* =========================================
           RESTORE SELECTED EXAM
        ========================================= */

        const selectedExam =
            localStorage.getItem(
                "adminSelectedExam"
            );


        if (selectedExam) {

            const selectedCard =
                document.getElementById(
                    `exam-card-${selectedExam}`
                );


            if (selectedCard) {

                selectedCard.classList.add(
                    "selected"
                );

            }

        }

    }


    catch(error) {

        console.error(
            "LOAD EXAMS ERROR:",
            error
        );


        const box =
            document.getElementById(
                "exams"
            );


        if (box) {

            box.innerHTML = `

                <div
                    class="empty"
                    id="examsError"
                >

                    خطا در اتصال به سرور

                </div>

            `;

        }

    }

}



/* =========================================
   CREATE EXAM META
========================================= */

function createExamMeta(
    iconName,
    value
) {

    const item =
        document.createElement(
            "span"
        );


    item.className =
        "exam-meta-item";


    item.innerHTML = `

        <i
            data-lucide="${iconName}"
        ></i>

        <span></span>

    `;


    const valueElement =
        item.querySelector(
            "span"
        );


    valueElement.textContent =
        value;


    return item;

}



/* =========================================
   OPEN EXAM
========================================= */

function openExam(
    examId
) {

    if (!examId) {

        console.error(
            "EXAM ID NOT FOUND"
        );

        return;

    }


    console.log(
        "SELECTED EXAM:",
        examId
    );


    /* =========================================
       SAVE SELECTED EXAM
    ========================================= */

    localStorage.setItem(
        "adminSelectedExam",
        examId
    );



    /* =========================================
       REMOVE PREVIOUS SELECTED CARD
    ========================================= */

    document
        .querySelectorAll(
            ".exam-card"
        )
        .forEach(
            card => {

                card.classList.remove(
                    "selected"
                );

            }
        );



    /* =========================================
       SELECT CURRENT CARD
    ========================================= */

    const selectedCard =
        document.getElementById(
            `exam-card-${examId}`
        );


    if (selectedCard) {

        selectedCard.classList.add(
            "selected"
        );

    }



    /* =========================================
       LOAD PARTICIPANTS
    ========================================= */

    loadUsers();






    /* =========================================
       SCROLL TO DETAILS
    ========================================= */

    const details =
        document.getElementById(
            "examDetailsSection"
        );


    if (details) {

        details.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}



/* =========================================
   LOAD USERS
========================================= */

async function loadUsers() {

    const box =
        document.getElementById(
            "participantsList"
        );


    const count =
        document.getElementById(
            "participantsCount"
        );


    try {


        /* =================================
           GET SELECTED EXAM
        ================================= */

        const examId =
            localStorage.getItem(
                "adminSelectedExam"
            );


        console.log(
            "CURRENT EXAM ID:",
            examId
        );



        /* =================================
           CHECK EXAM
        ================================= */

        if (!examId) {

            if (count) {

                count.textContent =
                    "۰ نفر";

            }


            if (box) {

                box.innerHTML = `

                    <div
                        class="empty"
                        id="participantsEmpty"
                    >

                        یک آزمون را انتخاب کنید

                    </div>

                `;

            }

            return;

        }



        /* =================================
           LOADING
        ================================= */

        if (box) {

            box.innerHTML = `

                <div
                    class="empty"
                    id="participantsLoading"
                >

                    در حال دریافت شرکت‌کنندگان...

                </div>

            `;

        }



        /* =================================
           API REQUEST
        ================================= */

        const response =
            await fetch(
                `${API_URL}/admin/results/users/${examId}`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ERROR: ${response.status}`
            );

        }



        /* =================================
           RESPONSE
        ================================= */

        const data =
            await response.json();


        console.log(
            "USERS DATA:",
            data
        );



        /* =================================
           API ERROR
        ================================= */

        if (!data.success) {

            if (count) {

                count.textContent =
                    "۰ نفر";

            }


            if (box) {

                box.innerHTML = `

                    <div
                        class="empty"
                        id="participantsError"
                    >

                        ${
                            data.message ||
                            "خطا در دریافت کاربران"
                        }

                    </div>

                `;

            }

            return;

        }



        /* =================================
           NO USERS
        ================================= */

        if (
            !Array.isArray(
                data.users
            ) ||
            data.users.length === 0
        ) {

            if (count) {

                count.textContent =
                    "۰ نفر";

            }


            if (box) {

                box.innerHTML = `

                    <div
                        class="empty"
                        id="participantsEmpty"
                    >

                        هیچ کاربری در این آزمون شرکت نکرده است

                    </div>

                `;

            }

            return;

        }



        /* =================================
           UPDATE COUNT
        ================================= */

        if (count) {

            count.textContent =
                `${data.users.length} نفر`;

        }



        /* =================================
           CLEAR
        ================================= */

        box.innerHTML = "";



        /* =================================
           CREATE PARTICIPANTS
        ================================= */

        data.users.forEach(
            (user, index) => {


                /* =================================
                   ITEM
                ================================= */

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "participant-item";


                item.id =
                    `participant-${user.userId}`;


                item.dataset.userId =
                    user.userId;


                item.dataset.examId =
                    examId;



                /* =================================
                   AVATAR
                ================================= */

                const avatar =
                    document.createElement(
                        "div"
                    );


                avatar.className =
                    "participant-avatar";


                const avatarColors = [
                    "",
                    "blue",
                    "purple",
                    "green"
                ];


                const colorClass =
                    avatarColors[
                        index %
                        avatarColors.length
                    ];


                if (colorClass) {

                    avatar.classList.add(
                        colorClass
                    );

                }


                const name =
                    user.fullname ||
                    "بدون نام";


                avatar.textContent =
                    name
                        .trim()
                        .charAt(0) ||
                    "؟";



                /* =================================
                   USER INFO
                ================================= */

                const info =
                    document.createElement(
                        "div"
                    );


                info.className =
                    "participant-info";


                const userName =
                    document.createElement(
                        "strong"
                    );


                userName.textContent =
                    name;


                const userRole =
                    document.createElement(
                        "span"
                    );


                userRole.textContent =
                    "شرکت‌کننده";


                info.appendChild(
                    userName
                );


                info.appendChild(
                    userRole
                );



                /* =================================
                   RANK
                ================================= */

                const rank =
                    document.createElement(
                        "span"
                    );


                rank.className =
                    "participant-rank";


                rank.textContent =
                    `#${index + 1}`;



                /* =================================
                   CLICK
                ================================= */

                item.addEventListener(
                    "click",
                    () => {

                        openUserAnalysis(
                            examId,
                            user.userId
                        );

                    }
                );



                /* =================================
                   ASSEMBLE
                ================================= */

                item.appendChild(
                    avatar
                );


                item.appendChild(
                    info
                );


                item.appendChild(
                    rank
                );


                box.appendChild(
                    item
                );

            }
        );



        /* =================================
           LUCIDE
        ================================= */

        if (
            typeof lucide !==
            "undefined"
        ) {

            lucide.createIcons();

        }

    }


    catch(error) {

        console.error(
            "LOAD USERS ERROR:",
            error
        );


        if (count) {

            count.textContent =
                "۰ نفر";

        }


        if (box) {

            box.innerHTML = `

                <div
                    class="empty"
                    id="participantsError"
                >

                    خطا در اتصال به سرور

                </div>

            `;

        }

    }

}



/* =========================================
   OPEN USER ANALYSIS
========================================= */
/* =========================================
   OPEN USER ANALYSIS
========================================= */

function openUserAnalysis(
    examId,
    userId
) {

    if (
        !examId ||
        !userId
    ) {

        console.error(
            "EXAM ID OR USER ID NOT FOUND",
            {
                examId,
                userId
            }
        );

        return;

    }


    console.log(
        "SELECTED USER:",
        {
            examId,
            userId
        }
    );


    /* =========================================
       SAVE SELECTED USER
    ========================================= */

    localStorage.setItem(
        "analysisExamId",
        examId
    );

    localStorage.setItem(
        "analysisUserId",
        userId
    );


    /* =========================================
       REMOVE PREVIOUS SELECTED USER
    ========================================= */

    document
        .querySelectorAll(
            ".participant-item"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "selected"
                );

            }
        );


    /* =========================================
       SELECT CURRENT USER
    ========================================= */

    const selectedParticipant =
        document.getElementById(
            `participant-${userId}`
        );


    if (selectedParticipant) {

        selectedParticipant.classList.add(
            "selected"
        );

    }


    /* =========================================
       LOAD RESULT
    ========================================= */

    loadSelectedUserResult(
        examId,
        userId
    );


    /* =========================================
       SCROLL TO RESULT
    ========================================= */

    const resultCard =
        document.getElementById(
            "myResultCard"
        );


    if (resultCard) {

        resultCard.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }

}

/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadExams();

    }
);










 
/* =========================================
   LOAD SELECTED USER RESULT
========================================= */

async function loadSelectedUserResult(
    examId,
    userId
) {

    /* =========================================
       ELEMENTS
    ========================================= */

    const resultCard =
        document.getElementById(
            "myResultCard"
        );

    const resultTitle =
        document.querySelector(
            "#resultTitle strong"
        );

    const resultSubtitle =
        document.querySelector(
            "#resultTitle span"
        );

    const resultStatus =
        document.getElementById(
            "resultStatus"
        );

    const resultScoreValue =
        document.getElementById(
            "resultScoreValue"
        );

    const resultScoreTotal =
        document.getElementById(
            "resultScoreTotal"
        );

    const resultScorePercent =
        document.getElementById(
            "resultScorePercent"
        );

    const correctCount =
        document.getElementById(
            "correctCount"
        );

    const wrongCount =
        document.getElementById(
            "wrongCount"
        );

    const unansweredCount =
        document.getElementById(
            "unansweredCount"
        );

    const resultTimeValue =
        document.getElementById(
            "resultTimeValue"
        );

    const userRank =
        document.getElementById(
            "userRank"
        );

    const rankTotal =
        document.getElementById(
            "rankTotal"
        );

    const rankProgressFill =
        document.getElementById(
            "rankProgressFill"
        );


    /* =========================================
       CHECK IDS
    ========================================= */

    if (
        !examId ||
        !userId
    ) {

        console.error(
            "EXAM ID OR USER ID NOT FOUND"
        );

        return;

    }


    /* =========================================
       LOADING STATE
    ========================================= */

    if (resultStatus) {

        resultStatus.textContent =
            "در حال دریافت...";

    }


    if (resultScoreValue) {

        resultScoreValue.textContent =
            "-";

    }


    if (resultScoreTotal) {

        resultScoreTotal.textContent =
            "/ -";

    }


    if (resultScorePercent) {

        resultScorePercent.textContent =
            "-";

    }


    if (correctCount) {

        correctCount.textContent =
            "-";

    }


    if (wrongCount) {

        wrongCount.textContent =
            "-";

    }


    if (unansweredCount) {

        unansweredCount.textContent =
            "-";

    }


    if (resultTimeValue) {

        resultTimeValue.textContent =
            "-";

    }


    if (userRank) {

        userRank.textContent =
            "-";

    }


    if (rankTotal) {

        rankTotal.textContent =
            "-";

    }


    if (rankProgressFill) {

        rankProgressFill.style.width =
            "0%";

    }


    try {


        /* =========================================
           API URL
        ========================================= */

        const url =
            `${API_URL}/admin/analysis/${examId}/${userId}`;


        console.log(
            "RESULT REQUEST URL:",
            url
        );


        /* =========================================
           REQUEST
        ========================================= */

        const response =
            await fetch(
                url
            );


        const raw =
            await response.text();


        console.log(
            "RESULT SERVER RAW:",
            raw
        );


        /* =========================================
           JSON
        ========================================= */

        let data;


        try {

            data =
                JSON.parse(
                    raw
                );

        }
        catch {

            throw new Error(
                "SERVER JSON RETURN نکرد"
            );

        }


        console.log(
            "SELECTED USER RESULT:",
            data
        );


        /* =========================================
           API ERROR
        ========================================= */

        if (
            !data ||
            !data.success
        ) {

            throw new Error(
                data?.message ||
                "نتیجه آزمون پیدا نشد"
            );

        }


        /* =========================================
           DATA
        ========================================= */

        const user =
            data.user || {};

        const exam =
            data.exam || {};

        const summary =
            data.summary || {};



        /* =========================================
           USER NAME
        ========================================= */

        if (resultTitle) {

            resultTitle.textContent =
                `نتیجه آزمون ${user.fullname || ""}`;

        }


        if (resultSubtitle) {

            resultSubtitle.textContent =
                exam.title
                    ? `عملکرد ${user.fullname || "دانش‌آموز"} در آزمون ${exam.title}`
                    : "عملکرد دانش‌آموز در آزمون انتخاب‌شده";

        }


        /* =========================================
           STATUS
        ========================================= */

        if (resultStatus) {

            resultStatus.textContent =
                "شرکت کرده";

        }



        /* =========================================
           SCORE
        ========================================= */

        const correct =
            Number(
                summary.correct || 0
            );


        const wrong =
            Number(
                summary.wrong || 0
            );


        const empty =
            Number(
                summary.empty || 0
            );


        const totalQuestions =
            Number(
                exam.totalQuestions ||
                exam.questionCount ||
                (
                    correct +
                    wrong +
                    empty
                )
            );


        const answered =
            correct +
            wrong;


        const percent =
            Number(
                summary.percent || 0
            );


        if (resultScoreValue) {

            resultScoreValue.textContent =
                correct;

        }


        if (resultScoreTotal) {

            resultScoreTotal.textContent =
                `/ ${totalQuestions}`;

        }


        if (resultScorePercent) {

            resultScorePercent.textContent =
                `${percent}%`;

        }



        /* =========================================
           STATISTICS
        ========================================= */

        if (correctCount) {

            correctCount.textContent =
                correct;

        }


        if (wrongCount) {

            wrongCount.textContent =
                wrong;

        }


        if (unansweredCount) {

            unansweredCount.textContent =
                empty;

        }



        /* =========================================
           TIME
        ========================================= */

        let timeText =
            "-";


        if (
            data.time != null
        ) {

            timeText =
                data.time;

        }
        else if (
            data.durationUsed != null
        ) {

            timeText =
                data.durationUsed;

        }
        else if (
            summary.time != null
        ) {

            timeText =
                summary.time;

        }
        else if (
            summary.timeSpent != null
        ) {

            timeText =
                summary.timeSpent;

        }


        if (resultTimeValue) {

            resultTimeValue.textContent =
                timeText;

        }



        /* =========================================
           RANK
        ========================================= */

        let rank =
            data.rank ??
            summary.rank ??
            null;


        let totalParticipants =
            data.totalParticipants ??
            summary.totalParticipants ??
            data.participants ??
            null;


        if (
            userRank &&
            rank != null
        ) {

            userRank.textContent =
                rank;

        }


        if (
            rankTotal &&
            totalParticipants != null
        ) {

            rankTotal.textContent =
                totalParticipants;

        }


        /* =========================================
           RANK PROGRESS
        ========================================= */

        if (
            rankProgressFill &&
            rank != null &&
            totalParticipants
        ) {

            const progress =
                Math.max(
                    0,
                    Math.min(
                        100,
                        (
                            (
                                totalParticipants -
                                rank +
                                1
                            ) /
                            totalParticipants
                        ) * 100
                    )
                );


            rankProgressFill.style.width =
                `${progress}%`;

        }



        /* =========================================
           SAVE SELECTED USER
        ========================================= */

        localStorage.setItem(
            "analysisExamId",
            examId
        );


        localStorage.setItem(
            "analysisUserId",
            userId
        );



        /* =========================================
           ICONS
        ========================================= */

        if (
            typeof lucide !==
            "undefined"
        ) {

            lucide.createIcons();

        }

    }


    catch(error) {

        console.error(
            "LOAD SELECTED USER RESULT ERROR:",
            error
        );


        if (resultStatus) {

            resultStatus.textContent =
                "خطا";

        }


        if (resultScoreValue) {

            resultScoreValue.textContent =
                "-";

        }


        if (resultScoreTotal) {

            resultScoreTotal.textContent =
                "/ -";

        }


        if (resultScorePercent) {

            resultScorePercent.textContent =
                "-";

        }

    }

}



















// =========================================
// THEME TOGGLE
// =========================================

const themeToggle =
    document.getElementById("themeToggle");

const savedTheme =
    localStorage.getItem("theme");


// =========================================
// APPLY SAVED THEME
// =========================================

if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-theme"
    );

}


// =========================================
// THEME BUTTON
// =========================================

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-theme"
            );


            const isDark =
                document.body.classList.contains(
                    "dark-theme"
                );


            localStorage.setItem(
                "theme",
                isDark
                    ? "dark"
                    : "light"
            );

        }
    );

}
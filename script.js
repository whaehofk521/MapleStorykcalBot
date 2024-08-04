const $form = document.querySelector("#chatForm");
const $input = document.querySelector("#chatInput");
const $chatList = document.querySelector("#chatList");

let url = `https://open-api.jejucodingcamp.workers.dev/`;

// 기본 질문
let defaultQuestion = "안녕하십니까, 대적자님. 검은마법사로부터 메이플월드를 지키기 위해서라면 신체 단련은 필수입니다. 먹은 음식을 말씀해 주시면 칼로리를 계산해 드리겠습니다.";

// 질문과 답변 데이터 저장
let data = [
    {
        role: "system",
        content: "assistant는 사용자가 먹은 음식의 칼로리를 계산해주는 역할을 합니다. assistant의 본명은 '나인하트 폰 루비스타인'입니다. 남성이며, 종족은 인간입니다. 현재 '에레브'라는 지역에서 시그너스 기사단 및 메이플 연합의 책사를 맡고 있습니다. 가족은 '리엔'이라는 지역에 거주하고 있는 여동생 '리린'이 있습니다. assistant는 시그너스 기사단 대부분의 행정과 연합의 중재사무를 맡고 있으며 시그너스 여제를 보좌합니다. 에레브에 경계령을 선포하거나 기사를 전투지역에 파견하는 등 군사적 업무도 맡고 있습니다. 주위에서 잘생겼다는 소리를 종종 듣고 있으며, 나이는 20대 정도입니다. 대표적인 대사로는 '여제를 위해서라면 그 무엇이라도 해낼 수 있습니까?'입니다. 높은 곳을 무서워하며, 신체 능력이 그다지 좋지는 않은 편입니다. 성격은 까탈스러우며 독설을 많이 합니다. 경어체를 사용하지만 상대를 비꼬는 말투를 자주 사용합니다. 일처리는 매우 철저하게 하는 편이며, 일처리를 서툴게 하는 상대는 봉급을 깎아버립니다. 정의롭고 이상적인 면이 강하며, 어릴 적부터 리엔에서 적인 검은마법사를 막기 위한 방법을 연구하며 시그너스 기사단과 연합 창설에 일조하였습니다. 본인의 성격이 냉철하다는 것은 본인도 알고 있습니다. 하지만 보좌하고 있는 시그너스 여제에게는 약한 편이며, 절대적인 충성심을 보여줍니다. 여동생인 리린과의 관계는 그다지 좋지 않으며, 리린에게는 유일하게 반말을 사용합니다. assistant는 사용자를 '대적자님'이라고 부릅니다. 사용자가 1,000칼로리보다 칼로리가 높은 고칼로리 음식을 먹었을 경우에는 '과도한 칼로리 섭취는 신체 단련에 좋지 않습니다. 계속 그렇게 드시면 이번달은 감봉하겠습니다.' 라고 말합니다. 하지만 1,000칼로리 미만의 칼로리를 섭취했을 경우 감봉 관련 얘기는 하지 않습니다. 또한 사용자가 섭취한 칼로리를 소모하려면 해야할 운동도 추천해 줍니다.",
    },
];

// 화면에 뿌려줄 질문 데이터
let questionData = [];

// 초기 질문 출력
const initChat = () => {
    printAnswer(defaultQuestion);
};

// 사용자의 질문을 객체로 저장
const sendQuestion = (question) => {
    if (question) {
        data.push({
            role: "user",
            content: question,
        });
        questionData.push({
            role: "user",
            content: question,
        });
    }
};

// 화면에 질문을 출력
const printQuestion = (question) => {
    let li = document.createElement("li");
    li.classList.add("question");
    li.innerText = question;
    $chatList.appendChild(li);
    questionData = [];
    scrollToBottom();
};

// 화면에 답변을 출력
const printAnswer = (answer) => {
    let li = document.createElement("li");
    li.classList.add("answer");
    li.innerText = answer;
    $chatList.appendChild(li);
    scrollToBottom();
};

// 스크롤 자동 이동
const scrollToBottom = () => {
    $chatList.scrollTop = $chatList.scrollHeight;
};

// API 요청 함수
const apiPost = async () => {
    try {
        const li = document.createElement("li");
        li.classList.add("answer");
        li.innerText = "잠시만 기다려주시겠습니까?..";
        $chatList.appendChild(li);
        scrollToBottom();

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        $chatList.removeChild(li);
        printAnswer(result.choices[0].message.content);
    } catch (error) {
        console.error("Error:", error);
        li.innerText = "오류가 발생했습니다.";
    }
};

// 폼 제출 이벤트 리스너
$form.addEventListener("submit", (e) => {
    e.preventDefault();
    const food = $input.value.trim();

    if (food !== "") {
        let userQuestion = `${food}`;
        sendQuestion(userQuestion);
        printQuestion(userQuestion);
        apiPost();
        $input.value = "";
    }
});

// 초기화 호출
initChat();

const toggleBtn = document.getElementById("toggle-chatbot");
const chatContainer = document.getElementById("chat-container");

// Mở/đóng chatbot với hiệu ứng
toggleBtn.addEventListener("click", () => {
  if (chatContainer.style.display === "none" || !chatContainer.style.display) {
    chatContainer.style.display = "block";
    chatContainer.style.animation = 'openBox 0.5s ease-out forwards'; // Hiệu ứng mở
  } else {
    chatContainer.style.animation = 'closeBox 0.5s ease-in forwards'; // Hiệu ứng đóng
    setTimeout(() => {
      chatContainer.style.display = 'none';
    }, 500); // Sau khi hiệu ứng đóng kết thúc
  }
});

async function sendMessage() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Hiển thị tin nhắn người dùng
  chat.innerHTML += `
    <div class="message user-message">
      <div class="text"><strong>Bạn:</strong> ${userMessage}</div>
    </div>`;
  input.value = '';
  chat.scrollTop = chat.scrollHeight;

  try {
    // Gửi yêu cầu tới server Flask
    const response = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const botMessage = data.answer || 'Không có câu trả lời từ chatbot';

    // Thay thế ký tự xuống dòng '\n' thành thẻ <br>
    const formattedBotMessage = botMessage.replace(/\n/g, '<br>');

    // Hiển thị tin nhắn chatbot với phong cách đẹp mắt
    chat.innerHTML += `
      <div class="message bot">
        <div class="avatar">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" class="avatar-img" />
        </div>
        <div class="text">
          <strong>Hướng dẫn viên:</strong>
          <div class="bot-response">${formattedBotMessage}</div>
        </div>
      </div>`;
    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    chat.innerHTML += `<div style="color:red; padding: 10px;">Không thể kết nối đến server 😢</div>`;
    console.error(error);
  }
}

// Gửi tin nhắn khi nhấn nút "Gửi"
document.getElementById("send").addEventListener("click", sendMessage);

// Gửi tin nhắn khi nhấn Enter
document.getElementById("input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

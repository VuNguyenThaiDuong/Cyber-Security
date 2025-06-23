from flask import Flask, request, jsonify, Blueprint
import requests

# Khởi tạo chatbot blueprint
chatbot_blueprint = Blueprint('chatbot', __name__)

# Định nghĩa route cho chatbot
@chatbot_blueprint.route('/ask', methods=['POST'])
def ask_chatbot():
    # Lấy câu hỏi từ client
    user_message = request.json.get('message')

    if not user_message:
        return jsonify({"error": "Câu hỏi không hợp lệ."}), 400

    # In ra thông báo debug khi bắt đầu nhận yêu cầu
    print(f"Đang nhận yêu cầu: {user_message}")

    # Định nghĩa prompt cho Ollama chỉ được dùng tiếng việt 
    
    prompt = f"Bạn là một hướng dẫn viên du lịch thân thiện tại Việt Nam. Hãy chỉ trả lời bằng tiếng Việt. Không sử dụng tiếng Anh. Câu hỏi: '{user_message}'"


    print(f"Đang tạo prompt cho Ollama: {prompt}")

    max_tokens = 20  # Số lượng token tối đa cho phản hồi vì cho ra nó bị lâu quá 

    # Gửi yêu cầu tới Ollama API
    try:
        print("Đang gửi yêu cầu tới Ollama...")
        response = requests.post(
            'http://localhost:11434/api/generate',  # Địa chỉ Ollama
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False,
                "max_tokens": max_tokens,
            }
        )

        data = response.json()
        print(f"Nhận phản hồi từ Ollama: {data}")  # In ra dữ liệu phản hồi từ Ollama

        # Trả lời từ Ollama
        if 'response' in data:
            bot_reply = data['response'].strip()
            print(f"Bot trả lời: {bot_reply}")  # In ra câu trả lời của bot
            return jsonify({"answer": bot_reply})

        else:
            print("Không nhận được phản hồi từ Ollama.")
            return jsonify({"error": "Không nhận được phản hồi từ Ollama."}), 500

    except Exception as e:
        # Xử lý lỗi khi không thể kết nối tới Ollama
        print(f"Lỗi khi kết nối tới Ollama: {e}")
        return jsonify({"error": "Không thể kết nối đến Ollama."}), 500

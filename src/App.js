import React, { useState, useRef, useEffect } from 'react';

// Cấu hình Tailwind CSS (đã được thêm vào môi trường)
// <script src="https://cdn.tailwindcss.com"></script>

// Biểu tượng (sử dụng SVG inline cho đơn giản)
const MicIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14a2 2 0 0 1-2-2V6a2 2 0 0 1 4 0v6a2 2 0 0 1-2 2zm0-10a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V8a4 4 0 0 0-4-4z" />
    <path d="M17 12a1 1 0 0 0-1 1v1.42A5.992 5.992 0 0 1 12 19a5.992 5.992 0 0 1-4-1.58V13a1 1 0 0 0-2 0v.42A7.99 7.99 0 0 0 11 21v2a1 1 0 0 0 2 0v-2a7.99 7.99 0 0 0 5-7.58V13a1 1 0 0 0-1-1z" />
  </svg>
);

const StopIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z" />
  </svg>
);

const PlayIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Danh sách câu hỏi mẫu
const sampleQuestions = [
  {
    id: 1,
    questionText: "Thủ đô của nước Việt Nam là gì?",
    correctAnswerText: "hà nội",
  },
  {
    id: 2,
    questionText: "Một cộng một bằng mấy?",
    correctAnswerText: "hai",
  },
  {
    id: 3,
    questionText: "Mặt trời mọc ở hướng nào?",
    correctAnswerText: "đông",
  },
  {
    id: 4,
    questionText: "Con gì có thể bay mà không cần cánh?",
    correctAnswerText: "con diều", // Đáp án có thể đa dạng, đây là một ví dụ
  }
];

function App() {
  const [questions, setQuestions] = useState(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null); // Để nghe lại (tùy chọn)
  const [transcript, setTranscript] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Dọn dẹp URL object khi component unmount hoặc audioUrl thay đổi
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return stream;
    } catch (err) {
      console.error("Lỗi truy cập microphone:", err);
      setError("Không thể truy cập microphone. Vui lòng cấp quyền và thử lại.");
      return null;
    }
  };

  const startRecording = async () => {
    setError('');
    setFeedbackMessage('');
    setTranscript('');
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);

    const stream = await requestMicrophonePermission();
    if (!stream) return;

    setIsRecording(true);
    audioChunksRef.current = [];
    
    // Kiểm tra MIME type được hỗ trợ
    const options = { mimeType: 'audio/webm;codecs=opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn(`${options.mimeType} không được hỗ trợ. Thử audio/ogg;codecs=opus.`);
        options.mimeType = 'audio/ogg;codecs=opus';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.warn(`${options.mimeType} không được hỗ trợ. Thử audio/wav.`);
            options.mimeType = 'audio/wav'; // Thường không được hỗ trợ tốt cho streaming
             if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.warn(`${options.mimeType} không được hỗ trợ. Sử dụng mặc định.`);
                options.mimeType = ''; // Để trình duyệt tự chọn
            }
        }
    }

    mediaRecorderRef.current = new MediaRecorder(stream, options);
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      // Tự động dừng stream mic sau khi ghi âm xong
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Chỉ lấy phần base64 data
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const normalizeText = (text) => {
    if (!text) return '';
    return text.toLowerCase().trim()
      // Tùy chọn: loại bỏ dấu tiếng Việt để so sánh dễ hơn (cân nhắc kỹ)
      // .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,?!]/g, ''); // Loại bỏ một số dấu câu cơ bản
  };

  const handleCheckAnswer = async () => {
    if (!audioBlob) {
      setError("Vui lòng ghi âm câu trả lời trước.");
      return;
    }

    setIsLoading(true);
    setError('');
    setFeedbackMessage('');
    setTranscript('');

    try {
      const base64Audio = await blobToBase64(audioBlob);
      const audioMimeType = audioBlob.type || 'audio/webm'; // Lấy MIME type từ blob

      let chatHistory = [];
      chatHistory.push({ 
        role: "user", 
        parts: [
          { text: "Hãy chuyển giọng nói trong đoạn âm thanh này thành văn bản tiếng Việt một cách chính xác nhất có thể. Văn bản trả về chỉ nên chứa nội dung được nói, không thêm bất kỳ lời dẫn hay giải thích nào khác." },
          {
            inlineData: {
              mimeType: audioMimeType, 
              data: base64Audio
            }
          }
        ] 
      });
      
      const payload = { contents: chatHistory };
      const apiKey = "AIzaSyBZmgaQnBt199xHZGU5aPs08nlTEycXew4"; // API key sẽ được cung cấp bởi môi trường Canvas
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Lỗi API Gemini:", errorData);
        throw new Error(`Lỗi API: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0 && result.candidates[0].content.parts[0].text) {
        
        const transcribed = result.candidates[0].content.parts[0].text;
        setTranscript(transcribed);

        const normalizedTranscribed = normalizeText(transcribed);
        const normalizedCorrectAnswer = normalizeText(currentQuestion.correctAnswerText);
        
        console.log("Đã nhận dạng:", transcribed, "| Chuẩn hóa:", normalizedTranscribed);
        console.log("Đáp án đúng:", currentQuestion.correctAnswerText, "| Chuẩn hóa:", normalizedCorrectAnswer);


        if (normalizedTranscribed === normalizedCorrectAnswer) {
          setFeedbackMessage("Chính xác! Tuyệt vời!");
        } else {
          setFeedbackMessage(`Chưa đúng. Đáp án của bạn: "${transcribed}". Đáp án đúng là: "${currentQuestion.correctAnswerText}"`);
        }
      } else {
        console.error("Cấu trúc phản hồi API không mong đợi:", result);
        setTranscript('');
        setFeedbackMessage("Không thể nhận dạng giọng nói. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra đáp án:", err);
      setError(`Đã xảy ra lỗi: ${err.message}. Vui lòng thử lại.`);
      setFeedbackMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setTranscript('');
    setFeedbackMessage('');
    setError('');
    setIsRecording(false);
     if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="bg-white/20 backdrop-blur-md shadow-xl rounded-xl p-6 md:p-8 w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-yellow-300">Ứng dụng Hỏi Đáp Vui</h1>
        
        {currentQuestion ? (
          <>
            <div className="mb-6 p-4 bg-white/10 rounded-lg">
              <p className="text-lg md:text-xl font-semibold mb-1">Câu hỏi {currentQuestionIndex + 1}/{questions.length}:</p>
              <p className="text-xl md:text-2xl">{currentQuestion.questionText}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full sm:w-auto bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
                >
                  <MicIcon className="w-6 h-6 mr-2" />
                  Bắt đầu Ghi âm
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full sm:w-auto bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
                >
                  <StopIcon className="w-6 h-6 mr-2" />
                  Dừng Ghi âm
                </button>
              )}

              <button
                onClick={handleCheckAnswer}
                disabled={!audioBlob || isLoading || isRecording}
                className="flex items-center justify-center w-full sm:w-auto bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
              >
                {isLoading ? <Spinner /> : <PlayIcon className="w-6 h-6 mr-2" />}
                Kiểm tra Đáp án
              </button>
            </div>
            
            {audioUrl && !isRecording && (
                <div className="my-4 text-center">
                    <p className="text-sm mb-1">Nghe lại câu trả lời của bạn:</p>
                    <audio controls src={audioUrl} className="mx-auto rounded-md shadow"></audio>
                </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-700/50 text-white rounded-lg text-center">
                <p>{error}</p>
              </div>
            )}

            {transcript && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="font-semibold">Bạn đã nói:</p>
                <p className="italic">"{transcript}"</p>
              </div>
            )}

            {feedbackMessage && (
              <div className={`mt-4 p-4 rounded-lg text-center font-semibold text-lg flex items-center justify-center
                ${feedbackMessage.startsWith("Chính xác") ? 'bg-green-600/80' : 'bg-orange-600/80'}`}>
                {feedbackMessage.startsWith("Chính xác") ? 
                  <CheckCircleIcon className="w-7 h-7 mr-2"/> : 
                  <XCircleIcon className="w-7 h-7 mr-2"/>
                }
                {feedbackMessage}
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={handleNextQuestion}
                disabled={isLoading}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-8 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 disabled:bg-gray-300"
              >
                Câu hỏi Tiếp theo
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-xl">Không có câu hỏi nào được tải.</p>
        )}
         <footer className="mt-8 text-center text-xs text-white/70">
            <p>Sử dụng API của Gemini để chuyển đổi giọng nói thành văn bản.</p>
            <p>Lưu ý: Chất lượng nhận dạng phụ thuộc vào mic và môi trường ghi âm.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

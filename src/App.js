import React, { useState, useRef, useEffect } from 'react';

// Cấu hình Tailwind CSS (đã được thêm vào môi trường nếu bạn dùng CDN)
// <script src="https://cdn.tailwindcss.com"></script>

// --- Biểu tượng SVG ---
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

const VolumeUpIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
);


const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
// --- Kết thúc Biểu tượng SVG ---

// --- Danh sách câu hỏi mẫu ---
const sampleQuestions = [
  { id: 1, questionText: "H. Phụng vụ là gì?", correctAnswerText: "Thưa. Phụng vụ là việc Hội Thánh chính thức cử hành mầu nhiệm Đức Kitô, để thờ phượng Thiên Chúa và thánh hóa con người." },
  { id: 2, questionText: "Một cộng một bằng mấy?", correctAnswerText: "hai" },
  { id: 3, questionText: "Mặt trời mọc ở hướng nào?", correctAnswerText: "đông" },
  { id: 4, questionText: "Loài cá nào có thể sống trên cạn trong một thời gian dài và thậm chí leo cây?", correctAnswerText: "cá thòi lòi" }
];
// --- Kết thúc Danh sách câu hỏi mẫu ---

// Bên ngoài component App hoặc trong một useEffect với [] để chạy một lần
let availableVoices = [];

const populateVoiceList = () => {
  availableVoices = speechSynthesis.getVoices();
  console.log("Danh sách giọng đọc đã được cập nhật:", availableVoices.length, "giọng.");
  // Bạn có thể log chi tiết ở đây nếu muốn
  // availableVoices.forEach(v => console.log(v.name, v.lang));
};

// Gọi lần đầu để thử lấy
if (typeof speechSynthesis !== 'undefined') {
    populateVoiceList();
    // Đăng ký sự kiện để cập nhật khi danh sách thay đổi
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    } else {
        // Fallback nếu onvoiceschanged không được hỗ trợ (hiếm)
        // Hoặc nếu trình duyệt cần thêm thời gian
        setTimeout(populateVoiceList, 250); // Thử lại sau một chút
        setTimeout(populateVoiceList, 750); // Thử lại sau một chút nữa
    }
}


// Hàm speakText được cập nhật
const speakText = (text, lang = 'vi-VN', onEndCallback = null) => {
  if ('speechSynthesis' in window) {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // Luôn đặt lang để trình duyệt có thể tự chọn nếu không tìm thấy voice cụ thể

    // Sử dụng danh sách availableVoices đã được tải
    if (availableVoices.length > 0) {
      let vietnameseVoice = availableVoices.find(voice => voice.lang === lang && voice.name.toLowerCase().includes('female'));
      if (!vietnameseVoice) {
        vietnameseVoice = availableVoices.find(voice => voice.lang === lang);
      }
      if (vietnameseVoice) {
        utterance.voice = vietnameseVoice;
        // console.log("Đã chọn giọng:", vietnameseVoice.name);
      } else {
        console.warn(`Không tìm thấy giọng đọc tiếng Việt (${lang}) cụ thể trong danh sách đã tải. Trình duyệt sẽ tự chọn dựa trên lang.`);
      }
    } else {
        console.warn("Danh sách giọng đọc chưa được tải hoặc rỗng. Trình duyệt sẽ tự chọn dựa trên lang.");
    }
    
    if (onEndCallback && typeof onEndCallback === 'function') {
      utterance.onend = onEndCallback;
    } else {
      utterance.onend = () => { /* console.log("Speech ended."); */ };
    }
    utterance.onerror = (event) => {
      console.error("Lỗi SpeechSynthesisUtterance:", event);
    };

    speechSynthesis.speak(utterance);
    return utterance;
  } else {
    console.warn("Web Speech API (Text-to-Speech) không được trình duyệt này hỗ trợ.");
    if (onEndCallback && typeof onEndCallback === 'function') {
      onEndCallback();
    }
    return null;
  }
};


function App() {
  const [questions, setQuestions] = useState(sampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isLoadingSTT, setIsLoadingSTT] = useState(false); // Loading cho Speech-to-Text
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false); // Loading cho giải thích AI
  const [error, setError] = useState('');
  const [currentUtterance, setCurrentUtterance] = useState(null); // Quản lý giọng đọc hiện tại

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const currentQuestion = questions[currentQuestionIndex];

  // --- API Key Configuration ---
  // QUAN TRỌNG: Thay thế bằng API Key của bạn. 
  // CÂN NHẮC SỬ DỤNG BACKEND PROXY CHO PRODUCTION ĐỂ BẢO VỆ KEY.
  const GEMINI_API_KEY = "AIzaSyBZmgaQnBt199xHZGU5aPs08nlTEycXew4"; 
  // --- End API Key Configuration ---


  // Dọn dẹp URL object
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (currentUtterance && speechSynthesis.speaking) speechSynthesis.cancel();
    };
  }, [audioUrl, currentUtterance]);

  // Tự động đọc câu hỏi và reset trạng thái khi chuyển câu hỏi
  useEffect(() => {
    if (currentQuestion && currentQuestion.questionText) {
      const utterance = speakText(currentQuestion.questionText);
      setCurrentUtterance(utterance);
    }
    // Reset các trạng thái cho câu hỏi mới
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl); // Dọn dẹp URL cũ
    setAudioUrl(null);
    setTranscript('');
    setFeedbackMessage('');
    setError('');
    setIsRecording(false);
    setIsLoadingSTT(false);
    setIsLoadingExplanation(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, [currentQuestionIndex]); // Chỉ phụ thuộc vào currentQuestionIndex

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return stream;
    } catch (err) {
      console.error("Lỗi truy cập microphone:", err);
      const errMsg = "Không thể truy cập microphone. Vui lòng cấp quyền và thử lại.";
      setError(errMsg);
      speakText(errMsg);
      return null;
    }
  };

  const startRecording = async () => {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
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
    
    const options = { mimeType: 'audio/webm;codecs=opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/ogg;codecs=opus';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = ''; // Để trình duyệt tự chọn
        }
    }

    mediaRecorderRef.current = new MediaRecorder(stream, options);
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      stream.getTracks().forEach(track => track.stop()); // Dừng stream mic
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
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const normalizeText = (text) => {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/[.,?!"]/g, '');
  };

  const handleCheckAnswer = async () => {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    if (!audioBlob) {
      const errMsg = "Vui lòng ghi âm câu trả lời trước.";
      setError(errMsg);
      speakText(errMsg);
      return;
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
        const errMsg = "Lỗi: API Key của Gemini chưa được cấu hình. Vui lòng kiểm tra lại.";
        setError(errMsg);
        speakText(errMsg);
        setIsLoadingSTT(false);
        setIsLoadingExplanation(false);
        return;
    }

    setIsLoadingSTT(true);
    setError('');
    setFeedbackMessage('');
    setTranscript('');
    setIsLoadingExplanation(false);

    try {
      const base64Audio = await blobToBase64(audioBlob);
      const audioMimeType = audioBlob.type || 'audio/webm';

      // --- Bước 1: Speech-to-Text ---
      const payloadSTT = {
        contents: [{
          role: "user",
          parts: [
            { text: "Hãy chuyển giọng nói trong đoạn âm thanh này thành văn bản tiếng Việt một cách chính xác nhất có thể. Văn bản trả về chỉ nên chứa nội dung được nói, không thêm bất kỳ lời dẫn hay giải thích nào khác." },
            { inlineData: { mimeType: audioMimeType, data: base64Audio } }
          ]
        }]
      };
      const apiUrlSTT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const responseSTT = await fetch(apiUrlSTT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadSTT)
      });

      if (!responseSTT.ok) {
        const errorData = await responseSTT.json();
        console.error("Lỗi API Gemini (STT):", errorData);
        throw new Error(`Lỗi API STT: ${errorData.error?.message || responseSTT.statusText}`);
      }
      const resultSTT = await responseSTT.json();
      const transcribed = resultSTT.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!transcribed) {
        const noTranscriptMsg = "Không thể nhận dạng giọng nói. Vui lòng thử lại.";
        setTranscript('');
        setFeedbackMessage(noTranscriptMsg);
        speakText(noTranscriptMsg);
        setIsLoadingSTT(false);
        return; // Dừng ở đây
      }
      
      setTranscript(transcribed);
      setIsLoadingSTT(false);

      // --- Bước 2: So sánh đáp án và đưa ra phản hồi ---
      const normalizedTranscribed = normalizeText(transcribed);
      const normalizedCorrectAnswer = normalizeText(currentQuestion.correctAnswerText);

      if (normalizedTranscribed === normalizedCorrectAnswer) {
        const correctMsg = "Chính xác! Tuyệt vời!";
        setFeedbackMessage(correctMsg);
        speakText(correctMsg);
      } else {
        // Khi trả lời sai, AI sẽ giải thích
        const initialIncorrectMsg = `Bạn trả lời là: "${transcribed}". Chưa đúng rồi.`;
        setFeedbackMessage(initialIncorrectMsg); // Phản hồi trực quan ban đầu
        
        // Đọc thông báo ban đầu, sau đó mới lấy giải thích
        speakText("Bạn ơi, câu trả lời chưa chính xác.", 'vi-VN', async () => {
            setIsLoadingExplanation(true); // Bắt đầu loading cho giải thích
            setFeedbackMessage(prev => prev + "\nĐể AI xem lại và giải thích cho bạn nhé...");

            // --- Bước 3: Gọi Gemini để tạo giải thích chi tiết ---
            try {
                const explanationPrompt = `Câu hỏi là: "${currentQuestion.questionText}". Đáp án đúng của câu hỏi này là: "${currentQuestion.correctAnswerText}". Học sinh đã trả lời là: "${transcribed}". Hãy đưa ra một lời giải thích ngắn gọn (tối đa 2-3 câu), thân thiện, dễ hiểu bằng tiếng Việt cho học sinh, chỉ ra điểm chưa đúng trong câu trả lời của học sinh hoặc gợi ý về đáp án đúng. Bắt đầu bằng một cách xưng hô thân mật như "Bạn ơi," hoặc "Này bạn,".`;
                
                const explanationPayload = {
                  contents: [{ role: "user", parts: [{ text: explanationPrompt }] }]
                };
                const apiUrlExplanation = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

                const explanationResponse = await fetch(apiUrlExplanation, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(explanationPayload)
                });

                if (!explanationResponse.ok) {
                  const errorData = await explanationResponse.json();
                  console.error("Lỗi API Gemini (Explanation):", errorData);
                  throw new Error(`Lỗi API giải thích: ${errorData.error?.message || explanationResponse.statusText}`);
                }
                const explanationResult = await explanationResponse.json();
                let detailedFeedback = explanationResult.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!detailedFeedback) {
                  detailedFeedback = `Đáp án đúng là: "${currentQuestion.correctAnswerText}". Hãy cố gắng hơn nhé!`;
                }
                
                setFeedbackMessage(prev => `${initialIncorrectMsg}\n${detailedFeedback}`);
                speakText(detailedFeedback);

            } catch (explanationError) {
                console.error("Lỗi khi tạo giải thích từ AI:", explanationError);
                const fallbackMsg = `Đáp án đúng là: "${currentQuestion.correctAnswerText}". Lần sau cố gắng hơn nhé!`;
                setFeedbackMessage(prev => `${initialIncorrectMsg}\n${fallbackMsg}`);
                speakText(fallbackMsg);
            } finally {
                setIsLoadingExplanation(false);
            }
        });
      }
    } catch (err) {
      console.error("Lỗi trong quá trình kiểm tra đáp án:", err);
      const errorMsg = `Đã xảy ra lỗi: ${err.message}. Vui lòng thử lại.`;
      setError(errorMsg);
      // speakText(errorMsg); // Có thể đọc lỗi nếu muốn
      setIsLoadingSTT(false);
      setIsLoadingExplanation(false);
    }
  };

  const handleNextQuestion = () => {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    setCurrentUtterance(null); // Dừng giọng đọc hiện tại (nếu có)
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    // Các reset khác đã được xử lý trong useEffect của currentQuestionIndex
  };

  const handleReadQuestionAgain = () => {
    if (currentQuestion && currentQuestion.questionText) {
        if (speechSynthesis.speaking) speechSynthesis.cancel();
        const utterance = speakText(currentQuestion.questionText);
        setCurrentUtterance(utterance);
    }
  };

  const isCurrentlyBusy = isLoadingSTT || isLoadingExplanation || isRecording || (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="bg-white/25 backdrop-blur-lg shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-yellow-300">Ứng dụng Hỏi Đáp Vui</h1>
        
        {currentQuestion ? (
          <>
            <div className="mb-6 p-4 bg-white/10 rounded-lg relative">
              <p className="text-lg md:text-xl font-semibold mb-1">Câu hỏi {currentQuestionIndex + 1}/{questions.length}:</p>
              <p className="text-xl md:text-2xl">{currentQuestion.questionText}</p>
              <button
                title="Đọc lại câu hỏi"
                onClick={handleReadQuestionAgain}
                disabled={isCurrentlyBusy}
                className="absolute top-2 right-2 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full shadow-md transition duration-150 ease-in-out transform hover:scale-110 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <VolumeUpIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isCurrentlyBusy}
                  className="flex items-center justify-center w-full sm:w-auto bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
                >
                  <MicIcon className="w-6 h-6 mr-2" />
                  Bắt đầu Ghi âm
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  disabled={isLoadingSTT || isLoadingExplanation} // Chỉ vô hiệu hóa bởi loading, không phải isRecording
                  className="flex items-center justify-center w-full sm:w-auto bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
                >
                  <StopIcon className="w-6 h-6 mr-2" />
                  Dừng Ghi âm
                </button>
              )}

              <button
                onClick={handleCheckAnswer}
                disabled={!audioBlob || isRecording || isLoadingSTT || isLoadingExplanation || (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) }
                className="flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
              >
                {isLoadingSTT ? <Spinner /> : (isLoadingExplanation ? <Spinner /> : <PlayIcon className="w-6 h-6 mr-2" />)}
                {isLoadingSTT ? 'Đang nhận dạng...' : (isLoadingExplanation ? 'AI Đang giải thích...' : 'Kiểm tra Đáp án')}
              </button>
            </div>
            
            {audioUrl && !isRecording && (
                <div className="my-4 text-center">
                    <p className="text-sm mb-1">Nghe lại câu trả lời của bạn:</p>
                    <audio controls src={audioUrl} className="mx-auto rounded-md shadow w-full max-w-xs"></audio>
                </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-700/60 text-white rounded-lg text-center">
                <p>{error}</p>
              </div>
            )}

            {transcript && !feedbackMessage && ( // Chỉ hiển thị transcript nếu chưa có feedbackMessage (tránh trùng lặp)
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="font-semibold">Bạn đã nói:</p>
                <p className="italic">"{transcript}"</p>
              </div>
            )}

            {feedbackMessage && (
              <div className={`mt-4 p-4 rounded-lg text-left font-semibold text-lg whitespace-pre-line 
                ${feedbackMessage.toLowerCase().includes("chính xác") ? 'bg-green-600/80' : 'bg-orange-600/80'}`}>
                <div className="flex items-start">
                    {feedbackMessage.toLowerCase().includes("chính xác") ? 
                    <CheckCircleIcon className="w-7 h-7 mr-3 flex-shrink-0 mt-1"/> : 
                    <XCircleIcon className="w-7 h-7 mr-3 flex-shrink-0 mt-1"/>
                    }
                    <p>{feedbackMessage}</p>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={handleNextQuestion}
                disabled={isCurrentlyBusy}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-8 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Câu hỏi Tiếp theo
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-xl">Không có câu hỏi nào được tải.</p>
        )}
         <footer className="mt-8 text-center text-xs text-white/80">
            <p>Sử dụng API của Gemini để chuyển đổi giọng nói và tạo giải thích.</p>
            <p>Tính năng đọc văn bản sử dụng Web Speech API của trình duyệt.</p>
            <p className="font-bold mt-2 text-yellow-200">Lưu ý: Hãy thay thế "YOUR_API_KEY_HERE" bằng API Key thực của bạn trong code.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useRef, useEffect } from 'react';

// --- Biểu tượng SVG (Giữ nguyên) ---
const MicIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a2 2 0 0 1-2-2V6a2 2 0 0 1 4 0v6a2 2 0 0 1-2 2zm0-10a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V8a4 4 0 0 0-4-4z" /><path d="M17 12a1 1 0 0 0-1 1v1.42A5.992 5.992 0 0 1 12 19a5.992 5.992 0 0 1-4-1.58V13a1 1 0 0 0-2 0v.42A7.99 7.99 0 0 0 11 21v2a1 1 0 0 0 2 0v-2a7.99 7.99 0 0 0 5-7.58V13a1 1 0 0 0-1-1z" /></svg>
);
const StopIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z" /></svg>
);
const PlayIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);
const CheckCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const XCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ChevronLeftIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
);
const ChevronRightIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
);
const RefreshIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
);
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);
// --- Kết thúc Biểu tượng SVG ---

// --- CSS Animations ---
const CustomStyles = () => (
  <style>{`
    @keyframes pop-in {
      0% { transform: scale(0.95); opacity: 0.6; }
      50% { transform: scale(1.02); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-pop-in { animation: pop-in 0.4s ease-out; }

    @keyframes shake-horizontal {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
      20%, 40%, 60%, 80% { transform: translateX(3px); }
    }
    .animate-shake-horizontal { animation: shake-horizontal 0.5s ease-in-out; }

    @keyframes gentle-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(251, 113, 133, 0.5); } /* rose-400 */
      50% { box-shadow: 0 0 0 8px rgba(251, 113, 133, 0); }
    }
    .animate-gentle-pulse { animation: gentle-pulse 1.5s infinite; }
  `}</style>
);
// --- Kết thúc CSS Animations ---


// --- Danh sách câu hỏi mẫu ---
const initialSampleQuestions = [
  {
    id: 1,
    questionText: "1. H. Phụng vụ là gì?",
    correctAnswerText: "Thưa. Phụng vụ là việc Hội Thánh chính thức cử hành mầu nhiệm Đức Kitô, để thờ phượng Thiên Chúa và thánh hóa con người.",
  },
  {
    id: 2,
    questionText: "2. H. Phụng vụ có vị trí nào trong Hội Thánh?",
    correctAnswerText: "Thưa. Phụng vụ là chóp đỉnh và là nguồn mạch các hoạt động của Hội Thánh, qua đó Đức Kitô tiếp tục công trình cứu độ của Ngài.",
  },
  {
    id: 3,
    questionText: "3. H. Đức Kitô tiếp tục công trình cứu độ của Ngài trong Hội Thánh thế nào?",
    correctAnswerText: "Thưa. Đức Kitô tiếp tục công trình cứu độ của Ngài trong Hội Thánh qua các bí tích được gọi là nhiệm cục bí tích.",
  },
  {
    id: 4,
    questionText: "4. H. Nhiệm cục bí tích là gì?",
    correctAnswerText: "Thưa. Nhiệm cục bí tích là sự chuyển thông ơn cứu độ của Chúa qua việc Hội Thánh cử hành các bí tích, nhất là bí tích Thánh Thể.",
  },
  {
    id: 5,
    questionText: "5. H. Ai hành động trong phụng vụ?",
    correctAnswerText: "Thưa. Chính “Đức Kitô toàn thể”, nghĩa là Đức Kitô cùng với Thân Thể của Ngài là Hội Thánh trên trời và Hội Thánh ở trần gian hành động trong phụng vụ.",
  },
  {
    id: 6,
    questionText: "6. H. Cử hành phụng vụ gồm những yếu tố nào?",
    correctAnswerText: "Thưa. Cử hành phụng vụ gồm hai yếu tố này: - Một là các dấu chỉ và biểu tượng, để diễn tả và thực hiện hành động cứu độ của Đức Kitô; - Hai là lời nói và hành động, nhờ đó con người gặp gỡ và đối thoại với Thiên Chúa.",
  },
  {
    id: 7,
    questionText: "7. H. Ngày Chúa Nhật quan trọng thế nào trong Năm phụng vụ?",
    correctAnswerText: "Thưa. Ngày Chúa Nhật rất quan trọng vì là “Ngày của Chúa”, ngày Chúa Phục Sinh. Vì thế, ngày Chúa Nhật là nền tảng và trung tâm của cả Năm Phụng vụ.",
  },
  {
    id: 8,
    questionText: "8. H. Năm phụng vụ là gì?",
    correctAnswerText: "Thưa. Năm Phụng vụ là thời gian Hội Thánh cử hành các mầu nhiệm Đức Kitô, để giúp chúng ta sống những mầu nhiệm ấy, hầu chuẩn bị đón Ngài lại đến trong vinh quang.",
  },
  {
    id: 9,
    questionText: "9. H. Phụng vụ Các Giờ Kinh là gì?",
    correctAnswerText: "Thưa. Phụng vụ Các Giờ Kinh là lời cầu nguyện của Đức Kitô cùng với Hội Thánh, để giúp các tín hữu thánh hóa thời gian trong ngày.",
  },
  {
    id: 10,
    questionText: "10. H. Bí tích là gì?",
    correctAnswerText: "Thưa. Bí tích là dấu chỉ bên ngoài Chúa Giê-su đã lập và truyền lại cho Hội Thánh cử hành, để diễn tả và thông ban cho chúng ta ân sủng bên trong là sự sống thần linh.",
  },
  {
    id: 11,
    questionText: "11. H. Có mấy bí tích?",
    correctAnswerText: "Thưa. Có 7 bí tích: - Một là Bí tích Rửa Tội; - Hai là Bí tích Thêm Sức; - Ba là Bí tích Thánh Thể; - Bốn là Bí tích Thống Hối; - Năm là Bí tích Xức Dầu Bệnh Nhân; - Sáu là Bí tích Truyền Chức Thánh; - Bảy là Bí tích Hôn Phối."
  },
  {
    id: 12,
    questionText: "12. H. Các bí tích của Hội Thánh được phân loại thế nào?",
    correctAnswerText: "Thưa. Các bí tích của Hội Thánh được phân thành ba loại này: - Một là các bí tích khai tâm Kitô giáo; - Hai là các bí tích chữa lành; - Ba là các bí tích phục vụ."
  },
  {
    id: 13,
    questionText: "13. H. Các bí tích khai tâm Kitô Giáo gồm những bí tích nào?",
    correctAnswerText: "Thưa. Các bí tích khai tâm Kitô giáo gồm Bí tích Rửa Tội, Thêm Sức và Thánh Thể. Các bí tích này tái sinh, củng cố và nuôi dưỡng các tín hữu trong đời sống mới."
  },
  {
    id: 14,
    questionText: "14. H. Các bí tích chữa lành gồm những bí tích nào?",
    correctAnswerText: "Thưa. Các bí tích chữa lành gồm Bí tích Thống Hối và Xức Dầu Bệnh Nhân. Các bí tích này phục hồi và củng cố đời sống mới của các tín hữu đã bị suy yếu hoặc mất đi do tội lỗi."
  },
  {
    id: 15,
    questionText: "15. H. Các bí tích phục vụ gồm những bí tích nào?",
    correctAnswerText: "Thưa. Các bí tích phục vụ gồm Bí tích Truyền Chức Thánh và Hôn Phối. Hai bí tích này đem lại ân sủng riêng cho mỗi sứ vụ đặc biệt trong Hội Thánh, để xây dựng Dân Thiên Chúa."
  },
  {
    id: 16,
    questionText: "16. H. Ấn tín bí tích là gì?",
    correctAnswerText: "Thưa. Ấn tín bí tích là dấu ấn thiêng liêng, Thiên Chúa in vào lòng những người lãnh Bí tích Rửa Tội, Thêm Sức, Truyền Chức Thánh, như lời hứa và bảo đảm cho sự che chở của Ngài. Vì ấn tín không thể xóa được, nên các bí tích này chỉ được lãnh một lần mà thôi."
  },
  {
    id: 17,
    questionText: "17. H. Vì sao gọi là bí tích đức tin?",
    correctAnswerText: "Thưa. Vì khi lãnh nhận bí tích, chúng ta phải có đức tin, đồng thời nhờ các bí tích, đức tin của chúng ta thêm mạnh mẽ vững vàng."
  },
  {
    id: 18,
    questionText: "18. H. Ai ban ân sủng trong các bí tích?",
    correctAnswerText: "Thưa. Chính Đức Kitô hoạt động và thông ban ân sủng trong các bí tích, nhưng ân sủng này có mang lại lợi ích hay không thì còn tùy thuộc vào sự chuẩn bị nội tâm của người lãnh nhận."
  },
  {
    id: 19,
    questionText: "19. H. Vì sao các bí tích cần thiết cho ơn cứu độ?",
    correctAnswerText: "Thưa. Vì các bí tích trao ban ân sủng của Chúa Thánh Thần, để Ngài chữa lành và biến đổi chúng ta."
  },
  {
    id: 20,
    questionText: "20. H. Các bí tích giúp chúng ta sống đời sống vĩnh cửu thế nào?",
    correctAnswerText: "Thưa. Các bí tích cho chúng ta tham dự trước vào đời sống vĩnh cửu, đang khi mong chờ ngày Đức Kitô ngự đến trong vinh quang."
  },
  {
    id: 21,
    questionText: "21. H. Bí Tích Rửa Tội là gì?",
    correctAnswerText: "Thưa. Là bí tích Chúa Giê-su đã lập, để làm cho chúng ta được sinh lại trong đời sống mới bởi nước và Thánh Thần."
  },
  {
    id: 22,
    questionText: "22. H. Nghi thức chính yếu của Bí Tích Rửa Tội là gì?",
    correctAnswerText: "Thưa. Nghi thức chính yếu của Bí Tích Rửa Tội là dìm xuống nước hay đổ nước trên đầu người lãnh bí tích và nói: “Tôi rửa anh, nhân danh Cha và Con và Thánh Thần.”"
  },
  {
    id: 23,
    questionText: "23. H. Bí Tích Rửa Tội có cần thiết cho ơn cứu độ không?",
    correctAnswerText: "Thưa. Bí Tích Rửa Tội cần thiết cho ơn cứu độ, đối với những ai đã nghe rao giảng Tin Mừng và có khả năng xin lãnh nhận bí tích này."
  },
  {
    id: 24,
    questionText: "24. H. Người không lãnh nhận Bí Tích Rửa Tội có được cứu độ không?",
    correctAnswerText: "Thưa. Người không lãnh Bí Tích Rửa Tội có thể được cứu độ trong ba trường hợp này: - Một là chết vì đức tin; - Hai là có lòng ước ao nhưng chưa có điều kiện lãnh nhận Bí Tích Rửa Tội; - Ba là chưa được biết Chúa Kitô và Hội Thánh, nhưng đã theo tiếng lương tâm mà sống ngay lành."
  },
  {
    id: 25,
    questionText: "25. H. Bí Tích Rửa Tội ban cho chúng ta những ơn nào?",
    correctAnswerText: "Thưa. Bí Tích Rửa Tội ban cho chúng ta những ơn này: - Một là được tha tội tổ tông và các tội riêng đã phạm; - Hai là được làm con cái Thiên Chúa; - Ba là được tháp nhập vào Đức Kitô và Hội Thánh; - Bốn là được ghi vào linh hồn dấu ấn thiêng liêng không bao giờ xóa được."
  },
  {
    id: 26,
    questionText: "26. H. Bí Tích Thêm Sức là gì?",
    correctAnswerText: "Thưa. Là bí tích Chúa Giê-su đã lập, để ban tràn đầy Chúa Thánh Thần, hầu giúp chúng ta sống ơn Bí Tích Rửa Tội cách mạnh mẽ và tốt đẹp hơn."
  },
  {
    id: 27,
    questionText: "27. H. Nghi thức chính yếu của Bí Tích Thêm Sức là gì?",
    correctAnswerText: "Thưa. Là việc xức dầu thánh trên trán người đã lãnh Bí Tích Rửa Tội, cùng với việc đặt tay trên đầu người ấy và đọc rằng “Hãy lãnh nhận ấn tín ơn Chúa Thánh Thần.”"
  },
  {
    id: 28,
    questionText: "28. H. Hiệu quả của Bí Tích Thêm Sức là gì?",
    correctAnswerText: "Thưa. Là việc đổ tràn Chúa Thánh Thần trên người lãnh bí tích, nhờ đó họ được ghi ấn tín không thể tẩy xóa và gia tăng ân sủng Bí Tích Rửa Tội."
  },
  {
    id: 29,
    questionText: "29. H. Người muốn lãnh nhận Bí Tích Thêm Sức cần phải làm gì?",
    correctAnswerText: "Thưa. Người lãnh Bí Tích Thêm Sức phải làm những điều này: - Một là phải sạch tội trọng; - Hai là phải học giáo lý, nhất là về Bí Tích Thêm Sức; - Ba là phải cầu nguyện sốt sắng và thật lòng ước ao lãnh nhận Chúa Thánh Thần."
  },
  {
    id: 30,
    questionText: "30. H. Người lãnh Bí Tích Thêm Sức có những bổn phận nào?",
    correctAnswerText: "Thưa. Người lãnh Bí Tích Thêm Sức có những bổn phận này: - Một là nỗ lực thi hành Lời Chúa trong đời sống thường ngày; - Hai là góp phần xây dựng xã hội theo tinh thần Tin Mừng; - Ba là tích cực giới thiệu Chúa cho mọi người."
  },
  {
    id: 31,
    questionText: "31. H. Bí Tích Thánh Thể là gì?",
    correctAnswerText: "Thưa. Là bí tích Chúa Giê-su đã lập, để tiếp tục lễ hy sinh trên Thánh giá và để ban Mình Máu Ngài, làm của ăn nuôi sống chúng ta."
  },
  {
    id: 32,
    questionText: "32. H. Chúa Giê-su đã lập Bí Tích Thánh Thể thế nào?",
    correctAnswerText: "Thưa. Khi tự nguyện nộp mình chịu khổ hình, Chúa Giê-su cầm lấy bánh, tạ ơn, bẻ ra và trao cho các môn đệ mà nói: “Tất cả các con hãy nhận lấy mà ăn: vì này là mình Thầy, sẽ bị nộp vì các con”. Cùng một thể thức ấy, sau bữa ăn tối, Người cầm lấy chén rượu, cũng tạ ơn, trao cho các môn đệ mà nói: “Tất cả các con hãy nhận lấy mà uống: vì này là chén máu Thầy, máu Giao ước mới và vĩnh cửu, sẽ đổ ra cho các con và nhiều người được tha tội: Các con hãy làm việc này mà nhớ đến Thầy.”"
  },
  {
    id: 33,
    questionText: "33. H. Bí Tích Thánh Thể có ý nghĩa gì trong đời sống Kitô giáo?",
    correctAnswerText: "Thưa. Bí Tích Thánh Thể là nguồn mạch và tột đỉnh của toàn bộ đời sống Kitô giáo, chứa đựng tất cả kho tàng thiêng liêng của Hội Thánh là chính Đức Kitô, Chiên Vượt Qua của chúng ta."
  },
  {
    id: 34,
    questionText: "34. H. Hội Thánh cử hành Bí Tích Thánh Thể thế nào?",
    correctAnswerText: "Thưa. Hội Thánh cử hành Bí Tích Thánh Thể trong Thánh lễ, gồm hai phần chính: - Một là Phụng vụ Lời Chúa, khởi đi từ lời nguyện nhập lễ cho đến hết lời nguyện chung; - Hai là Phụng vụ Thánh Thể, khởi đi từ việc chuẩn bị lễ vật cho đến hết lời nguyện hiệp lễ."
  },
  {
    id: 35,
    questionText: "35. H. Hội Thánh dạy thế nào về việc rước lễ?",
    correctAnswerText: "Thưa. Hội Thánh khuyên các tín hữu rước lễ mỗi khi tham dự Thánh lễ, và buộc rước lễ một năm ít là một lần trong mùa Phục Sinh."
  },
  {
    id: 36,
    questionText: "36. H. Phải có điều kiện nào để được rước lễ?",
    correctAnswerText: "Thưa. Phải có những điều kiện này: - Một là hoàn toàn thuộc về Hội Thánh Công Giáo; - Hai là ý thức mình không có tội trọng; - Ba là phải giữ chay theo quy định của Hội Thánh; - Bốn là có thái độ tôn kính Đức Kitô."
  },
  {
    id: 37,
    questionText: "37. H. Việc rước lễ đem lại cho chúng ta những ơn ích nào?",
    correctAnswerText: "Thưa. Việc rước lễ làm cho chúng ta được kết hợp mật thiết với Đức Kitô và Hội Thánh, được tẩy xóa các tội nhẹ, gia tăng ân sủng và lòng yêu mến tha nhân."
  },
  {
    id: 38,
    questionText: "38. H. Bí Tích Thống Hối là gì?",
    correctAnswerText: "Thưa. Là bí tích Chúa Giê-su đã lập, để tha các tội riêng chúng ta đã phạm từ khi lãnh Bí Tích Rửa Tội về sau, cùng giao hòa chúng ta với Thiên Chúa và Hội Thánh."
  },
  {
    id: 39,
    questionText: "39. H. Chúa Giê-su đã lập Bí Tích Thống Hối khi nào?",
    correctAnswerText: "Thưa. Chúa Giê-su đã lập Bí Tích Thống Hối khi Ngài hiện ra với các Tông đồ vào chiều ngày Phục Sinh và nói rằng: “Anh em hãy nhận lấy Thánh Thần; anh em tha tội cho ai, thì tội người ấy được tha; anh em cầm giữ ai, thì tội người ấy bị cầm giữ.”"
  },
  {
    id: 40,
    questionText: "40. H. Bí Tích Thống Hối có những yếu tố chính yếu nào?",
    correctAnswerText: "Thưa. Bí Tích Thống Hối có hai yếu tố chính yếu này: - Một là hành vi của người sám hối; - Hai là lời xá giải của linh mục."
  },
  {
    id: 41,
    questionText: "41. H. Muốn lãnh nhận Bí Tích Thống Hối chúng ta phải làm gì?",
    correctAnswerText: "Thưa. Muốn lãnh Bí Tích Thống Hối chúng ta phải làm bốn việc này: - Một là xét mình; - Hai là ăn năn và dốc lòng chừa; - Ba là xưng tội; - Bốn là đền tội."
  },
  {
    id: 42,
    questionText: "42. H. Khi nào các tín hữu buộc phải xưng các tội trọng?",
    correctAnswerText: "Thưa. Khi đến tuổi khôn, mọi tín hữu buộc phải xưng các tội trọng của mình ít nhất một năm một lần và trong mọi trường hợp, phải xưng các tội trọng trước khi rước lễ."
  },
  {
    id: 43,
    questionText: "43. H. Bí Tích Thống Hối có những hiệu quả nào?",
    correctAnswerText: "Thưa. Bí Tích Thống Hối có những hiệu quả này: - Một là tha tội để giao hòa chúng ta với Thiên Chúa và Hội Thánh; - Hai là tha hình phạt muôn đời do các tội trọng đã gây ra và tha một phần các hình phạt tạm; - Ba là ban sự bình an và gia tăng sức mạnh cho cuộc chiến đấu thiêng liêng của người Kitô hữu."
  },
  {
    id: 44,
    questionText: "44. H. Ân xá là gì?",
    correctAnswerText: "Thưa. Ân xá là việc tha thứ những hình phạt tạm đáng chịu vì những tội chúng ta đã phạm, dù những tội này đã được tha thứ."
  },
  {
    id: 45,
    questionText: "45. H. Bí Tích Xức Dầu Bệnh Nhân là gì?",
    correctAnswerText: "T. Là bí tích Chúa Giê su đã lập, để ban ơn nâng đỡ bệnh nhân và người già yếu, về phần hồn cũng như phần xác."
  },
  {
    id: 46,
    questionText: "46. H. Ai có thể lãnh Bí Tích Xức Dầu?",
    correctAnswerText: "T. Mọi tín hữu khi lâm bệnh nặng, khi gặp nguy tử hoặc bị yếu liệt vì tuổi già, đều có thể lãnh Bí Tích Xức Dầu."
  },
  {
    id: 47,
    questionText: "47. H. Bí Tích Xức Dầu được cử hành thế nào?",
    correctAnswerText: "T. Bí Tích Xức Dầu được cử hành qua việc xức dầu trên trán và hai lòng bàn tay, với lời nguyện xin ân sủng của bí tích này."
  },
  {
    id: 48,
    questionText: "48. H. Bí Tích Xức Dầu có những hiệu quả nào?",
    correctAnswerText: "T. Bí Tích Xức Dầu có những hiệu quả này:- Một là kết hợp bệnh nhân với cuộc khổ nạn của Chúa Kitô, để sinh ích cho họ và cho Hội Thánh;- Hai là mang lại cho họ niềm an ủi và lòng can đảm, để chịu đựng những đau đớn của bệnh tật hoặc tuổi già;- Ba là tha thứ các tội lỗi đã phạm nếu chưa xưng được;- Bốn là chữa lành thân xác nếu phù hợp với ý Chúa;- Năm là chuẩn bị cho “cuộc vượt qua” sang cõi sống đời đời."
  },
  {
    id: 49,
    questionText: "49. H. Bí Tích Truyền Chức Thánh là gì?",
    correctAnswerText: "T. Là bí tích Chúa Giê su đã lập, để ủy thác sứ vụ của Ngài cho các Tông đồ, nhờ đó sứ vụ này tiếp tục thực thi trong Hội Thánh cho đến ngày tận thế."
  },
  {
    id: 50,
    questionText: "50. H. Chúa Giê su lập Bí Tích Truyền Chức Thánh khi nào?",
    correctAnswerText: "T. Chúa Giê su lập Bí Tích Truyền Chức Thánh trong Bữa Tiệc Ly, khi Ngài nói với các Tông đồ rằng: “Anh em hãy làm việc này mà tưởng nhớ đến Thầy”."
  },
  {
    id: 51,
    questionText: "51. H. Bí Tích Truyền Chức Thánh có những hiệu quả nào?",
    correctAnswerText: "T. Bí Tích Truyền Chức Thánh có những hiệu quả này:- Một là ban tràn đầy Chúa Thánh Thần;- Hai là làm cho người thụ phong nên đồng hình đồng dạng với Đức Kitô trong ba chức năng tư tế, tiên tri và vương đế theo từng cấp bậc của Bí Tích Truyền Chức Thánh;- Ba là trao ban một ấn tín thiêng liêng không tẩy xóa được."
  },
  {
    id: 52,
    questionText: "52. H. Bí Tích Truyền Chức Thánh gồm những cấp bậc nào?",
    correctAnswerText: "T. Bí Tích Truyền Chức Thánh gồm ba cấp bậc này: một là phó tế, hai là linh mục, ba là giám mục."
  },
  {
    id: 53,
    questionText: "53. H. Những người lãnh Bí Tích Truyền Chức Thánh thi hành tác vụ với thẩm quyền nào?",
    correctAnswerText: "T. Những người lãnh Bí Tích Truyền Chức Thánh thi hành tác vụ với thẩm quyền không do cộng đoàn ủy thác, nhưng do Đức Kitô trao ban. Họ thi hành tác vụ trong cương vị Đức Kitô là Đầu và nhân danh Hội Thánh. Vì thế, chức tư tế thừa tác khác biệt với chức tư tế cộng đồng mà các tín hữu đã lãnh nhận khi được rửa tội."
  },
  {
    id: 54,
    questionText: "54. H. Người tín hữu có bổn phận nào đối với các vị Chủ chăn của mình?",
    correctAnswerText: "T. Người tín hữu có bổn phận cầu nguyện, tôn trọng, vâng lời và cộng tác với các vị Chủ chăn của mình trong việc xây dựng Hội Thánh, đồng thời giúp đỡ các ngài về cả tinh thần lẫn vật chất."
  },
  {
    id: 55,
    questionText: "55. H. Bí Tích Hôn Phối là gì?",
    correctAnswerText: "T. Là bí tích Chúa Giê su đã lập, để kết hợp hai người tín hữu một nam một nữ thành vợ chồng trước mặt Thiên Chúa và Hội Thánh, cùng ban ân sủng để họ yêu thương nhau như Ngài đã yêu thương Hội Thánh."
  },
  {
    id: 56,
    questionText: "56. H. Hôn nhân Công giáo có mục đích nào?",
    correctAnswerText: "T. Hôn nhân Công giáo có hai mục đích này:- Một là trọn đời yêu thương nhau;- Hai là sinh sản và dưỡng dục con cái."
  },
  {
    id: 57,
    questionText: "57. H. Bí Tích Hôn Phối được cử hành thế nào?",
    correctAnswerText: "T. Bí Tích Hôn Phối được cử hành cách công khai, trước sự chứng kiến của vị đại diện Hội Thánh và những người làm chứng."
  },
  {
    id: 58,
    questionText: "58. H. Muốn lãnh Bí Tích Hôn Phối phải có những điều kiện nào?",
    correctAnswerText: "T. Muốn lãnh Bí Tích Hôn Phối phải có những điều kiện này:- Một là đã lãnh nhận Bí Tích Rửa Tội;- Hai là không bị ngăn trở bởi luật tự nhiên và luật Hội Thánh;- Ba là hiểu biết về Bí Tích Hôn Phối và đời sống gia đình;- Bốn là có tự do kết hôn và công khai nói lên sự ưng thuận của mình theo nghi thức Hội Thánh."
  },
  {
    id: 59,
    questionText: "59. H. Hiệu quả của Bí Tích Hôn Phối là gì?",
    correctAnswerText: "T. Bí Tích Hôn Phối tạo nên mối dây liên kết vĩnh viễn và độc chiếm giữa hai người phối ngẫu. Vì thế hôn nhân thành sự và hoàn hợp giữa những người đã được rửa tội không bao giờ có thể tháo gỡ được. Bí Tích Hôn Phối còn ban ân sủng cần thiết để họ đạt tới sự thánh thiện trong đời sống hôn nhân."
  },
  {
    id: 60,
    questionText: "60. H. Chủ đề mục vụ năm 2025 của Tổng Giáo phận Hà Nội là gì?",
    correctAnswerText: "T. Chủ đề mục vụ năm 2025 của Tổng Giáo phận Hà Nội là “Canh tân đời sống đức tin trong cử hành phụng vụ.”"
  },
  {
    id: 61,
    questionText: "61. H. Canh tân đời sống đức tin trong cử hành phụng vụ là canh tân điều gì?",
    correctAnswerText: "T. Canh tân đời sống đức tin trong cử hành phụng vụ là làm mới lại lòng yêu mến, tinh thần tham dự và cung cách cử hành phụng vụ, qua đó khám phá lại, bảo toàn và sống trọn vẹn những ý nghĩa xác thực và sức mạnh của các cử hành phụng vụ."
  },
  {
    id: 62,
    questionText: "62. H. Tại sao cần phải canh tân đời sống đức tin trong cử hành phụng vụ?",
    correctAnswerText: "T. Phải canh tân đời sống đức tin trong cử hành phụng vụ vì những lý do này: - Thứ nhất vì phụng vụ là những mầu nhiệm thánh, là nguồn mạch trước tiên và thiết yếu để các tín hữu được thánh hoá, được hiệp thông mật thiết với Thiên Chúa và với nhau. - Thứ hai vì Hội Thánh tha thiết mong ước toàn thể các tín hữu được hướng dẫn tham dự cử hành phụng vụ cách trọn vẹn, ý thức và tích cực. - Thứ ba vì cần loại bỏ đi những cử hành cẩu thả, những lạm dụng vì thiếu hiểu biết, và thái độ tham dự khô khan nguội lạnh của nhiều tín hữu."
  },
  {
    id: 63,
    questionText: "63. H. Những ai được mời gọi phải canh tân đời sống đức tin trong cử hành phụng vụ?",
    correctAnswerText: "T. Toàn thể các tín hữu, những người đã chịu Phép Rửa Tội, đã trở nên dòng dõi ưu tuyển, hàng tư tế vương giả, dân tộc thánh thiện, và đoàn dân được tuyển chọn (x. 1 Pr 2,9), được mời gọi phải không ngừng canh tân chính mình, để tham dự và cử hành phụng vụ cách trọn vẹn, ý thức và hiệu quả."
  },
  {
    id: 64,
    questionText: "64. H. Các thừa tác viên chức thánh cần làm gì để canh tân đời sống đức tin trong cử hành phụng vụ?",
    correctAnswerText: "T. Các thừa tác viên chức thánh, nhất là các mục tử chăn dắt các linh hồn, cần phải làm những điều này: - Một là thấm nhuần sâu đậm tinh thần và năng lực của phụng vụ, và trở nên thầy dạy trong lãnh vực này. - Hai là luôn cử hành cách sốt sắng và trung thành các mầu nhiệm của Đức Kitô, đặc biệt là Hy tế Thánh Thể theo đúng tinh thần và luật phụng vụ của Hội Thánh. - Ba là chú trọng và kiên tâm thực hiện việc giảng dạy về phụng vụ cho các tín hữu, giúp họ tham dự phụng vụ tích cực cả bề trong lẫn bề ngoài."
  },
  {
    id: 65,
    questionText: "65. H. Các tín hữu giáo dân cần phải làm gì để canh tân đời sống đức tin trong cử hành phụng vụ?",
    correctAnswerText: "T. Các tín hữu giáo dân cần phải thực hiện những điều này: - Một là siêng năng tham dự phụng vụ, nhất là tham dự Thánh lễ cách trọn vẹn, ý thức và hiệu quả. - Hai là chăm chỉ học hỏi về phụng vụ và trong phụng vụ. - Ba là dập khuôn đời sống đức tin theo phụng vụ, sống tình bác ái và dấn thân loan báo Tin Mừng."
  },
  {
    id: 66,
    questionText: "66. H. Làm thế nào để tham dự phụng vụ cách đích thực và trọn vẹn?",
    correctAnswerText: "T. Tham dự phụng vụ cách đích thực và trọn vẹn là thực hiện những điều này: - Một là đến tham dự phụng vụ với thái độ sẵn sàng, chủ động, và hoà hợp cộng tác với ân sủng của Mầu nhiệm Thánh. - Hai là tham dự toàn vẹn cả tâm hồn và thể xác qua các cử chỉ, tư thế, hành động, lời đối đáp tung hô ca hát, và với sự thinh lặng cần thiết. - Ba là chăm chú lắng nghe Lời Chúa, tập dâng hiến chính mình hợp với Hy lễ Chúa Kitô, rước lễ và sống hiệp thông trọn vẹn với Thiên Chúa và với nhau. - Bốn là tham dự vào sứ vụ bác ái và truyền giáo sau cử hành phụng vụ."
  },
  {
    id: 67,
    questionText: "67. H. Các thừa tác viên như giúp lễ, đọc sách, dẫn lễ, và các ca viên cần phải làm gì để tham dự phụng vụ được trọn vẹn?",
    correctAnswerText: "T. Các thừa tác viên như giúp lễ, đọc sách, dẫn lễ, ca viên là đang thực hiện một thừa tác vụ đích thực trong phụng vụ. Để được trọn vẹn, họ cần thực hiện những điều này: - Một là thi hành trọn vẹn và chỉ thi hành những gì thuộc lãnh vực mình tuỳ theo bản chất sự việc và những quy tắc phụng vụ. - Hai là thi hành phận vụ với lòng đạo đức chân thành và nghiêm túc. - Ba là phải thấm nhuần tinh thần phụng vụ, chăm chỉ học hỏi và rèn luyện để chu toàn các phần việc của mình theo đúng nghi thức và quy định."
  },
  {
    id: 68,
    questionText: "68. H. Để tăng thêm sự hiểu biết và yêu mến phụng vụ, người tín hữu cần làm những gì?",
    correctAnswerText: "T. Người tín hữu cần làm những điều này: - Một là tham dự phụng vụ với thái độ ngỡ ngàng thán phục trước các mầu nhiệm được cử hành. - Hai là đào sâu khám phá vẻ đẹp của phụng vụ, nhất là ý nghĩa của ngôn ngữ biểu tượng trong phụng vụ. - Ba là chú tâm đến nghệ thuật cử hành, đến vẻ đẹp của chân lý, đến tính năng động và cách thức Chúa Thánh Thần tác động trong mỗi cử hành phụng vụ."
  },
  {
    id: 69,
    questionText: "69. H. Để nuôi dưỡng ý thức về sự thánh thiêng và cảm nhận nét đẹp của phụng vụ, cần phải loại bỏ những cung cách cử hành và thói quen tham dự phụng vụ nào?",
    correctAnswerText: "T. Để nuôi dưỡng ý thức về sự thánh thiêng và cảm nhận nét đẹp của phụng vụ, cần loại bỏ những thiếu sót này: - Một là cử hành phụng vụ cách cẩu thả, thiếu sự chuẩn bị, có thái độ kiêu ngạo lấy mình làm trung tâm, hoặc không tuân theo những nguyên tắc của phụng vụ. - Hai là tham dự phụng vụ như những khách bàng quan và câm lặng, dửng dưng bên ngoài, sử dụng điện thoại, hoặc nói chuyện riêng trong giờ phụng vụ. - Ba là thái độ đi lễ chỉ vì sợ tội, sợ dư luận, hoặc chỉ để cầu lợi cầu may mà thôi."
  },
  {
    id: 70,
    questionText: "70. H. Năm Thánh là gì?",
    correctAnswerText: "T. Năm Thánh hay còn gọi là năm Toàn Xá, là một thời kỳ hồng ân, qua đó Thiên Chúa ban ơn đặc biệt hơn khi con người mở lòng để thống hối và canh tân. Năm Thánh là thời gian giao hoà với Thiên Chúa và anh chị em, nhằm thánh hóa cuộc sống, củng cố đức tin, tạo cơ hội thuận tiện để xây dựng tình liên đới và hiệp thông huynh đệ trong lòng Giáo Hội và thế giới, khuyến khích mọi người tuyên xưng đức tin một cách chân thành và sống động hơn nơi Ðức Ki tô, Ðấng Cứu Ðộ duy nhất của nhân loại."
  },
  {
    id: 71,
    questionText: "71. H. Để mở Năm Thánh thường lệ 2025, Đức Thánh Cha Phan xi cô đã ban hành tông sắc gì?",
    correctAnswerText: "T. Đức Thánh Cha Phan xi cô đã ban hành tông sắc “Spes non Confundit” nghĩa là “Hy vọng không làm thất vọng”."
  },
  {
    id: 72,
    questionText: "72. H. Năm Thánh thường lệ 2025 có khẩu hiệu là gì?",
    correctAnswerText: "T. Năm Thánh 2025 có khẩu hiệu là “Những người hành hương của hy vọng”."
  },
  {
    id: 73,
    questionText: "73. H. Hành hương Năm Thánh mang những ý nghĩa gì?",
    correctAnswerText: "T. Hành hương Năm Thánh có những ý nghĩa này: - Một là lên đường hành hương đến một nơi thánh và bước qua Cửa thánh. - Hai là sống kinh nghiệm hoán cải, biến đổi chính bản thân để phù hợp với sự thánh thiện của Thiên Chúa. - Ba là cuộc hành trình ra khỏi chính mình, bước theo Đức Kitô như người môn đệ, để từng bước nên đồng hình đồng dạng với Người."
  },
  {
    id: 74,
    questionText: "74. H. Hy vọng Kitô giáo có những đặc tính nào?",
    correctAnswerText: "T. Hy vọng Kitô giáo có những đặc tính này: - Một là hy vọng phát sinh từ trái tim bị đâm thâu của Chúa Giê su trên thập giá. - Hai là hy vọng không lừa dối cũng không làm thất vọng. - Ba là hy vọng như cái neo chắc chắn và bền vững của tâm hồn, thả sâu vào nơi Chúa Giê su đã vào như người tiền phong mở đường cho chúng ta (x. Dt, chương 6, câu 19 đến câu 20; Giáo lý Hội Thánh Công Giáo số 1820). - Bốn là hy vọng đặt trên nền tảng đức tin và được nuôi dưỡng bằng đức ái, bằng tình yêu Thiên Chúa. - Năm là hy vọng hướng về cùng đích là hạnh phúc vĩnh cửu trong hiệp thông trọn vẹn với Thiên Chúa."
  },
  {
    id: 75,
    questionText: "75. H. Bởi đâu mà hy vọng Kitô giáo không lừa dối cũng không làm thất vọng?",
    correctAnswerText: "T. Hy vọng Kitô giáo không lừa dối cũng không làm thất vọng vì nó dựa trên tình yêu vô điều kiện mà Thiên Chúa đã đổ vào lòng chúng ta, nhờ Thánh Thần mà Người ban cho chúng ta (x. Rô ma chương 5, câu 5), giúp chúng ta xác tín rằng không có gì và không ai có thể tách chúng ta ra khỏi tình yêu của Thiên Chúa (x. Rô ma chương 8, câu 35 đến câu 39)."
  },
  {
    id: 76,
    questionText: "76. H. Người tín hữu cần làm gì để trở nên người hành hương của hy vọng?",
    correctAnswerText: "T. Để trở nên người hành hương của hy vọng, người tín hữu làm những điều này: - Một là kín múc niềm hy vọng nơi ân sủng của Thiên Chúa qua cuộc gặp gỡ sống động thân tình với Đức Ki tô, như đi hành hương, sống kiên nhẫn, ẩn náu nơi Thiên Chúa qua cầu nguyện và cử hành phụng vụ, nhất là qua bí tích hòa giải và lãnh nhận ân xá. - Hai là khám phá lại niềm hy vọng qua những dấu chỉ của thời đại, nhất là lưu tâm tới những điều thiện hảo trên thế giới. - Ba là sống chứng nhân và trở nên dấu chỉ của hy vọng cho con người trong thế giới hôm nay."
  },
  {
    id: 77,
    questionText: "77. H. Đức Thánh Cha Phan xi cô gợi mở những gì cần thực hiện để là dấu chỉ hy vọng cho thế giới hôm nay?",
    correctAnswerText: "T. Để là dấu chỉ hy vọng cho thế giới hôm nay, Đức Thánh Cha Phan xi cô đã gợi mở những điều này: - Một là dấn thân xây dựng hòa bình trên thế giới. - Hai là có lòng nhiệt thành với cuộc sống và sẵn sàng chia sẻ cuộc sống qua việc sinh thêm nhiều con cái và tìm lại niềm vui sống vì được tạo dựng theo hình ảnh Thiên Chúa. - Ba là biểu lộ sự gần gũi với các tù nhân, kêu gọi ân xá và giảm án, bãi bỏ án tử hình và giúp tù nhân tái hòa nhập cộng đồng. - Bốn là xoa dịu những đau khổ cho bệnh nhân bằng cách thăm nom trong tình yêu thương và sự gần gũi. - Năm là truyền cảm hứng cho giới trẻ, gần gũi và đồng hành với họ. - Sáu là mở rộng vòng tay đón nhận người di cư và tị nạn, sẵn sàng bảo vệ quyền lợi của những người yếu thế nhất. - Bảy là trân trọng và nâng đỡ người cao tuổi. - Tám là mang lại niềm hy vọng cho người nghèo, lập quỹ toàn cầu để triệt để xóa bỏ nạn đói, giúp cho nước nghèo phát triển, xóa nợ và tôn trọng môi sinh."
  },
  {
    id: 78,
    questionText: "78. H. Trở nên dấu chỉ hy vọng là trách nhiệm và bổn phận của ai?",
    correctAnswerText: "T. Tất cả những người đã được Rửa tội, mỗi người với đặc sủng và nhiệm vụ của mình, đều có trách nhiệm trở nên những dấu chỉ hy vọng minh chứng cho sự hiện diện của Thiên Chúa giữa lòng thế giới."
  },
  {
    id: 79,
    questionText: "79. H. Người tín hữu chứng minh về đức tin và đức mến trong lòng mình bằng cách nào?",
    correctAnswerText: "T. Người tín hữu chứng minh về đức tin và đức mến trong lòng mình bằng cách sống tràn đầy niềm hy vọng, để có thể trao đi dù chỉ là một nụ cười, một cử chỉ thân tình, một cái nhìn huynh đệ, một sự lắng nghe chân thành, một sự phục vụ vô vị lợi, vì biết rằng, trong Thần Khí của Chúa Giê su, điều này có thể trở thành hạt giống trổ sinh hy vọng nơi những ai đón nhận."
  }
];

// --- Kết thúc Danh sách câu hỏi mẫu ---

function App() {
  const [questions] = useState(initialSampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // 'correct' or 'incorrect' for animation
  const [isLoadingSTT, setIsLoadingSTT] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const feedbackKey = useRef(0); // For re-triggering animation

  const GEMINI_API_KEY = "AIzaSyBZmgaQnBt199xHZGU5aPs08nlTEycXew4";

  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;

  useEffect(() => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setTranscript('');
    setFeedbackMessage('');
    setFeedbackType('');
    feedbackKey.current += 1; // Change key to allow re-animation
    setError('');
    setIsRecording(false);
    setIsLoadingSTT(false);
    setIsLoadingExplanation(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, [audioUrl]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return stream;
    } catch (err) {
      setError("Không thể truy cập microphone. Vui lòng cấp quyền và thử lại.");
      return null;
    }
  };

  const startRecording = async () => {
    setError('');
    setFeedbackMessage('');
    setFeedbackType('');
    feedbackKey.current += 1;
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
        if (!MediaRecorder.isTypeSupported(options.mimeType)) options.mimeType = '';
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
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const normalizeText = (text) => {
    return text
      .replace(/“|”|"/g,'') // Loại bỏ dấu nháy
      .replace(/-/g,'') // Loại bỏ dấu gạch nối
      .replace(/[.,;|/?\\!@#$%^&*()_+=~`'{}\[\]:<>]/g,'') // Loại bỏ dấu chấm, phẩy và các ký tự đặc biệt
      .replace(/\s+/g,' ') // Thay thế nhiều khoảng trắng bằng một khoảng trắng
      .trim() // Cắt bỏ khoảng trắng thừa
      .toLowerCase(); // Chuyển đổi thành chữ thường
  };

  const handleCheckAnswer = async () => {
    feedbackKey.current += 1; // New key for animation
    if (!audioBlob) {
      setError("Vui lòng ghi âm câu trả lời trước.");
      return;
    }
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
        setError("Lỗi: API Key của Gemini chưa được cấu hình.");
        return;
    }

    setIsLoadingSTT(true);
    setError('');
    setFeedbackMessage('');
    setFeedbackType('');
    setTranscript('');
    setIsLoadingExplanation(false);

    try {
      const base64Audio = await blobToBase64(audioBlob);
      const audioMimeType = audioBlob.type || 'audio/webm';
      const payloadSTT = { contents: [{role: "user", parts: [{ text: "Hãy chuyển giọng nói trong đoạn âm thanh này thành văn bản tiếng Việt một cách chính xác nhất có thể. Văn bản trả về chỉ nên chứa nội dung được nói, không thêm bất kỳ lời dẫn hay giải thích nào khác." },{ inlineData: { mimeType: audioMimeType, data: base64Audio }}]}]};
      const apiUrlSTT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      const responseSTT = await fetch(apiUrlSTT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payloadSTT)});

      if (!responseSTT.ok) { const errorData = await responseSTT.json(); throw new Error(`Lỗi API STT: ${errorData.error?.message || responseSTT.statusText}`);}
      const resultSTT = await responseSTT.json();
      const transcribed = resultSTT.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!transcribed) {
        setTranscript('');
        setFeedbackMessage("Không thể nhận dạng giọng nói. Vui lòng thử lại.");
        setFeedbackType('incorrect');
        setIsLoadingSTT(false);
        return;
      }
      setTranscript(transcribed);
      setIsLoadingSTT(false);

      const normalizedTranscribed = normalizeText(transcribed);
      const normalizedCorrectAnswer = normalizeText(currentQuestion.correctAnswerText);

      if (normalizedTranscribed === normalizedCorrectAnswer) {
        setFeedbackMessage("Chính xác! Tuyệt vời!");
        setFeedbackType('correct');
      } else {
        setFeedbackType('incorrect');
        setIsLoadingExplanation(true);
        const detailedFeedback = `Đáp án đúng là: "${currentQuestion.correctAnswerText}". Hãy thử lại nhé!`;
        const initialIncorrectMsg = `Sai rùi hehe ^^.\n${detailedFeedback}`;;
        setFeedbackMessage(initialIncorrectMsg );

        // const explanationPrompt = `Câu hỏi là: "${currentQuestion.questionText}". Đáp án đúng của câu hỏi này là: "${currentQuestion.correctAnswerText}". Học sinh đã trả lời là: "${transcribed}". Hãy đưa ra một lời giải thích ngắn gọn (tối đa 2-3 câu), thân thiện, dễ hiểu bằng tiếng Việt cho học sinh, chỉ ra điểm chưa đúng trong câu trả lời của học sinh hoặc gợi ý về đáp án đúng. Bắt đầu bằng một cách xưng hô thân mật như "Bạn ơi," hoặc "Này bạn,".`;
        // const explanationPayload = { contents: [{ role: "user", parts: [{ text: explanationPrompt }] }]};
        // const apiUrlExplanation = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        // try {
        //     const explanationResponse = await fetch(apiUrlExplanation, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(explanationPayload)});
        //     if (!explanationResponse.ok) { const errorData = await explanationResponse.json(); throw new Error(`Lỗi API giải thích: ${errorData.error?.message || explanationResponse.statusText}`);}
        //     const explanationResult = await explanationResponse.json();
        //     let detailedFeedback = explanationResult.candidates?.[0]?.content?.parts?.[0]?.text;
        //     if (!detailedFeedback) detailedFeedback = `Đáp án đúng là: "${currentQuestion.correctAnswerText}". Hãy cố gắng hơn nhé!`;
        //     setFeedbackMessage(`${initialIncorrectMsg}\n${detailedFeedback}`);
        // } catch (explanationError) {
        //     const fallbackMsg = `Đáp án đúng là: "${currentQuestion.correctAnswerText}". Lần sau cố gắng hơn nhé!`;
        //     setFeedbackMessage(`${initialIncorrectMsg}\n${fallbackMsg}`);
        // } finally {
            setIsLoadingExplanation(false);
        // }
      }
    } catch (err) {
      setError(`Đã xảy ra lỗi: ${err.message}. Vui lòng thử lại.`);
      setIsLoadingSTT(false);
      setIsLoadingExplanation(false);
    }
  };

  const handlePreviousQuestion = () => { if (questions.length > 0) setCurrentQuestionIndex((prev) => (prev - 1 + questions.length) % questions.length);};
  const handleNextQuestion = () => { if (questions.length > 0) setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);};
  const handleRandomQuestion = () => { if (questions.length > 0) setCurrentQuestionIndex(Math.floor(Math.random() * questions.length));};

  const isCurrentlyBusy = isLoadingSTT || isLoadingExplanation || isRecording;

  return (
    <>
      <CustomStyles />
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-fuchsia-100 to-sky-100 flex flex-col items-center p-4 font-sans text-slate-700">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-600">AI Kiểm Tra Giáo Lý</h1>
          
          <div className="mb-6 text-center">
            <button
              onClick={handleRandomQuestion}
              disabled={isCurrentlyBusy}
              className="flex items-center justify-center mx-auto bg-violet-400 hover:bg-violet-500 disabled:bg-slate-200 disabled:text-slate-400 text-violet-900 font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150"
            >
              <RefreshIcon className="w-5 h-5 mr-2" />
              Câu hỏi Ngẫu nhiên
            </button>
          </div>

          {currentQuestion ? (
            <>
              <div className="mb-6 p-5 bg-white rounded-xl shadow-lg">
                <p className="text-sm md:text-base font-semibold mb-1.5 text-purple-500">
                  Câu hỏi {currentQuestionIndex + 1}/{questions.length}
                </p>
                <p className="text-xl md:text-2xl text-slate-800">{currentQuestion.questionText}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
                {!isRecording ? (
                  <button onClick={startRecording} disabled={isCurrentlyBusy}
                    className="flex items-center justify-center w-full sm:w-auto bg-emerald-400 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-emerald-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
                    <MicIcon className="w-6 h-6 mr-2" /> Bắt đầu Ghi âm
                  </button>
                ) : (
                  <button onClick={stopRecording} disabled={isLoadingSTT || isLoadingExplanation}
                    className={`flex items-center justify-center w-full sm:w-auto bg-rose-500 hover:bg-rose-600 disabled:bg-slate-200 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 animate-gentle-pulse`}
                  >
                    <StopIcon className="w-6 h-6 mr-2" /> Dừng Ghi âm
                  </button>
                )}
                <button onClick={handleCheckAnswer} disabled={!audioBlob || isCurrentlyBusy}
                  className="flex items-center justify-center w-full sm:w-auto bg-sky-400 hover:bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-sky-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
                  {(isLoadingSTT || isLoadingExplanation) ? <Spinner className="text-sky-800"/> : <PlayIcon className="w-6 h-6 mr-2" />}
                  {isLoadingSTT ? 'Đang nhận dạng...' : (isLoadingExplanation ? 'AI Phân tích...' : 'Kiểm tra Đáp án')}
                </button>
              </div>
              
              {audioUrl && !isRecording && (
                  <div className="my-5 text-center">
                      <p className="text-sm mb-1.5 text-slate-600">Nghe lại câu trả lời của bạn:</p>
                      <audio controls src={audioUrl} className="mx-auto rounded-lg shadow-md w-full max-w-xs"></audio>
                  </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center"><p>{error}</p></div>
              )}
              {transcript && feedbackMessage && ( // Chỉ hiển thị khi chưa có feedback cuối cùng
                <div className="mt-4 p-4 bg-slate-50 rounded-lg shadow">
                  <p className="font-semibold text-purple-500">Câu trả lời của bạn: </p>
                  <p className="italic text-slate-700">"{transcript}"</p>
                </div>
              )}
              {feedbackMessage && (
                <div 
                  key={feedbackKey.current} // Key để trigger animation khi message thay đổi
                  className={`mt-5 p-4 rounded-xl shadow-lg text-left font-semibold text-lg whitespace-pre-line transition-all duration-300
                  ${feedbackType === 'correct' ? 'bg-green-100 text-green-800 border border-green-300 animate-pop-in' 
                    : (feedbackType === 'incorrect' ? 'bg-red-100 text-red-800 border border-red-300 animate-shake-horizontal' : 'bg-slate-100 text-slate-700 border border-slate-300')}`}
                >
                  <div className="flex items-start">
                      {feedbackType === 'correct' ? 
                      <CheckCircleIcon className="w-7 h-7 mr-3 flex-shrink-0 mt-1 text-green-600"/> : 
                      (feedbackType === 'incorrect' ? <XCircleIcon className="w-7 h-7 mr-3 flex-shrink-0 mt-1 text-red-600"/> : null)
                      }
                      <p>{feedbackMessage}</p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between items-center">
                <button onClick={handlePreviousQuestion} disabled={isCurrentlyBusy || questions.length <= 1}
                  className="flex items-center bg-slate-300 hover:bg-slate-400 disabled:bg-slate-100 disabled:text-slate-400 text-slate-800 font-semibold py-2.5 px-5 rounded-lg shadow hover:shadow-md transition-all duration-150">
                  <ChevronLeftIcon className="w-5 h-5 mr-1.5" /> Câu trước
                </button>
                <button onClick={handleNextQuestion} disabled={isCurrentlyBusy || questions.length <= 1}
                  className="flex items-center bg-slate-300 hover:bg-slate-400 disabled:bg-slate-100 disabled:text-slate-400 text-slate-800 font-semibold py-2.5 px-5 rounded-lg shadow hover:shadow-md transition-all duration-150">
                  Câu tiếp <ChevronRightIcon className="w-5 h-5 ml-1.5" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-xl py-10 text-slate-600">Không có câu hỏi nào để hiển thị.</p>
          )}
           <footer className="mt-10 pt-6 border-t border-slate-300/70 text-center text-xs text-slate-500">
              <p>Nhấn vào nút Ghi âm để ghi âm câu trả lời và sau đó nhấn Kiểm tra xem đúng chưa nhé!</p>
              <p className="font-semibold mt-2 text-purple-600">Lưu ý: Nếu có lỗi gì sai gì inbox ngay cho Oppa nha, kamsahe ~~</p>
          </footer>
        </div>
      </div>
    </>
  );
}
export default App;
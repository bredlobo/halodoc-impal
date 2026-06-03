import { formatTime } from "../helpers/formatters";

/**
 * Chat bubble untuk pesan konsultasi.
 * Digunakan di ConsultationChat dan DoctorDashboard.
 */
export default function ChatBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isMine
            ? "rounded-br-sm bg-gradient-to-br from-teal-500 to-cyan-500 text-white"
            : "rounded-bl-sm bg-white text-slate-700 ring-1 ring-slate-100"
        }`}
      >
        <p>{message.content}</p>
        <p
          className={`mt-1 text-right text-[10px] ${
            isMine ? "text-teal-100" : "text-slate-400"
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

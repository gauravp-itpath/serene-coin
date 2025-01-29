import { AlertCircle } from "lucide-react"; // Import the AlertCircle icon from Lucide

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 space-y-6 m-4 bg-slate-700  rounded-lg
 max-w-md mx-auto"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Image or Illustration */}
        <img
          src="https://cloud.appwrite.io/v1/storage/buckets/6761570900080584d19c/files/6799dcc20009316752bd/view?project=6761470a00342024df5c" // Make sure to add an image file in the public folder for an illustration
          alt="Error Illustration"
          className="w-60 h-40 object-cover animate-pulse" // Tailwind's built-in 'pulse' animation"
          // className="w-32 h-32 object-cover animate-ping" // Tailwind's built-in 'ping' animation
          style={{ animationDuration: "3s" }}
        />
        {/* Error Message */}
        <p className="text-xl text-red-600 font-semibold text-center">
          {message}
        </p>
        {/* Lucide Alert Icon */}

        <button
          className="bg-white text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group"
          type="button"
        >
          <div
            className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10
           duration-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              height="25px"
              width="25px"
            >
              <path
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                fill="#000000"
              ></path>
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="#000000"
              ></path>
            </svg>
          </div>
          <p className="translate-x-2">Go Back</p>
        </button>
      </div>

      {/* Add a lighthearted message to make the user feel more at ease */}
      <p className="text-sm text-gray-600 mt-4">
        Oops! Something went wrong. Please try again.
      </p>
    </div>
  );
}

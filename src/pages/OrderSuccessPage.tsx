import { Link } from 'react-router-dom';

export function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-4">تم تقديم طلبك بنجاح!</h1>
        <p className="text-gray-600 mb-8">
          شكراً لطلبك! سنتواصل معك قريباً لتأكيد الطلب.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

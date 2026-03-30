import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 text-right flex justify-between items-center hover:text-primary"
      >
        <span className="font-medium">{question}</span>
        <span className="text-xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">{answer}</div>
      )}
    </div>
  );
}

export function FAQ() {
  const faqs = [
    {
      question: 'كيف يمكنني إنشاء حساب؟',
      answer: 'يمكنك إنشاء حساب بالضغط على زر "تسجيل الدخول" ثم اختيار "إنشاء حساب".',
    },
    {
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نقدم الدفع عند الاستلام لجميع الطلبات. يمكنك الدفع نقداً عند استلام المنتج.',
    },
    {
      question: 'كم تستغرق مدة الشحن؟',
      answer: 'تستغرق مدة الشحن من 2 إلى 5 أيام عمل حسب المدينة.',
    },
    {
      question: 'هل يمكنني إرجاع المنتج؟',
      answer: 'نعم، يمكنك إرجاع المنتج خلال 14 يوماً من الاستلام في حال كان غير مستعمل.',
    },
    {
      question: 'كيف أتواصل مع客服؟',
      answer: 'يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف المذكور في صفحة التواصل.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h2 className="text-2xl font-bold text-center mb-8">الأسئلة الشائعة</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

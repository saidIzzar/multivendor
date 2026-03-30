export function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">سياسة الإرجاع والاستبدال</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">فترة الإرجاع</h2>
          <p>
            يمكنك إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام. يجب أن يكون المنتج في حالته الأصلية وغير مستعمل.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">شروط الإرجاع</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>يجب أن يكون المنتج في غلافه الأصلي</li>
            <li>يجب أن تكون جميع الملصقات والعلامات موجودة</li>
            <li>يجب إرفاق فاتورة الشراء</li>
            <li>المنتجات المستعملة أو التالفة لا يمكن إرجاعها</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3"> процес الإرجاع</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>تواصل معنا عبر الهاتف أو البريد الإلكتروني</li>
            <li>سيقوم فريقنا بتأكيد طلب الإرجاع</li>
            <li>سيتم استلام المنتج من عنوانك</li>
            <li>يتم استرداد المبلغ خلال 7-14 يوم عمل</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">الاستبدال</h2>
          <p>
            يمكنك استبدال المنتج بمنتج آخر من نفس القيمة أو أعلى مع دفع الفرق. الاستبدال يخضع لنفس شروط الإرجاع.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">المبالغ المستردة</h2>
          <p>
            يتم استرداد المبلغ بنفس طريقة الدفع المستخدمة. قد يستغرق الأمر 7-14 يوم عمل ظهور المبلغ في حسابك.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">التواصل</h2>
          <p>لأي استفسار حول الإرجاع والاستبدال:</p>
          <ul className="mt-2">
            <li>الهاتف: +212 612 345 678</li>
            <li>البريد الإلكتروني: returns@multivendors.ma</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">سياسة الشحن</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-3">مدة الشحن</h2>
          <p>
            تستغرق مدة الشحن من 2 إلى 5 أيام عمل حسب المدينة. يتم معالجة الطلبات خلال 24-48 ساعة من تأكيد الطلب.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">تكلفة الشحن</h2>
          <p>تختلف تكلفة الشحن حسب المدينة من 20 إلى 80 درهماً.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>الرباط وسلا: 20 MAD</li>
            <li>الدار البيضاء: 25 MAD</li>
            <li>مراكش: 30 MAD</li>
            <li>طنجة وأكادير: 30-40 MAD</li>
            <li>مدن أخرى: حسب الموقع</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">الشحن المجاني</h2>
          <p>نقدم الشحن المجاني للطلبات التي تتجاوز 500 MAD.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">تتبع الشحن</h2>
          <p>سيتم إرسال رقم التتبع عبر SMS بمجرد شحن الطلب.</p>
        </section>
      </div>
    </div>
  );
}

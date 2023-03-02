import React from "react";

export function RefundOrderSummary({ products, GetPriceOrVariation }) {
  const [total, setTotal] = React.useState(0);
  React.useEffect(() => {
    let total = 0;
    if (products) {
      for (let i = 0; i < products.length; i++) {
        total += GetPriceOrVariation(products[i], 0);
      }
    }
    setTotal(total);
  }, [products]);
  return (
    <div className="refund-order-summary">
      <h6>Order Summary</h6>

      <table className="table table-borderless">
        <tbody>
          <tr className="refund-subtotal">
            <td className="text-secondary">Subtotal</td>
            <td className="text-secondary">
              {products[0].Currency} {total}
            </td>
          </tr>
          <tr className="refund-total">
            <td>Subtotal</td>
            <td>
              {products[0].Currency} {total}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

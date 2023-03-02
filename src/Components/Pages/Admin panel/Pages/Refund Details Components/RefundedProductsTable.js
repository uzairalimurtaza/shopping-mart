import Endpoint from "../../../../../Utils/Endpoint";

export function RefundedProductsTable({ products, GetPriceOrVariation }) {
  return (
    <table class="table table-borderless">
      <thead>
        <tr>
          <th scope="col-6" className="text-secondary fw-400">
            Product
          </th>
          <th scope="col-3" className="text-secondary fw-400">
            Quantity
          </th>
          <th scope="col-3" className="text-secondary fw-400">
            Price
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((item, index) => (
          <tr key={index}>
            <div className="row align-items-center">
              <div className="d-flex align-items-center">
                <div>
                  <img
                    class="w-100"
                    src={`${Endpoint}/${item.Medium}`}
                    style={{ maxWidth: "fit-content", height: "75px" }}
                  />
                </div>
                <div>
                  <h6 class="mb-0">{item.Title}</h6>
                </div>
              </div>
            </div>
            <td className="vertical-align-middle">{item.Quantity}</td>
            <td className="vertical-align-middle">
              {" "}
              {item.Currency} {GetPriceOrVariation(item, 0)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

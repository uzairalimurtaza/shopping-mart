function ShippingForm() {
  return (
    <main role="main" className="container">
      <div className="row">
        <div className="col-8">
          <h1 className="text-center">Api2Pdf</h1>
          <img src="https://www.api2pdf.com/wp-content/uploads/2018/07/600x150.png" />
          <h5 className="text-left" style={{ paddingTop: "10px" }}>
            Message from Purchaser
          </h5>
          <p className="text-left">
            Api2Pdf is a powerful PDF generation API with no rate limits or file
            size constraints. Generate PDFs from HTML, URLs, images, office
            documents, and more. Merge PDFs together. Api2Pdf runs on AWS
            Lambda, a serverless architecture powered by Amazon to scale to
            millions of requests while being up to 90% cheaper than
            alternatives. The REST API provides endpoints for WKHTMLTOPDF,
            Headless Chrome, LibreOffice, and Merge PDFs. Learn more at
            <a href="https://www.api2pdf.com">https://www.api2pdf.com</a>
          </p>
        </div>
        <div className="col-4 border border-dark">
          <img src="http://www.api2pdf.com/wp-content/uploads/2018/07/download-1.png" />
          <h4>Order Information</h4>
          <p className="lead">Order Number: 123456</p>
          <p>Purchased: 01/01/2018</p>
          <p>Shipped: 01/01/2018</p>
          <h4>Shipping To</h4>
          <p>John Doe</p>
          <p>123 Angel Blvd</p>
          <p>APT 7</p>
          <p>New York, NY 11111</p>
          <p>United States</p>
        </div>
      </div>
      <hr />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Item Code</th>
            <th scope="col">Item Name</th>
            <th scope="col">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="row">001</td>
            <td>Can of Beer</td>
            <td>1</td>
          </tr>
          <tr>
            <td scope="row">002</td>
            <td>T-Shirt - SMALL</td>
            <td>3</td>
          </tr>
          <tr>
            <td scope="row">003</td>
            <td>Men's Jeans - SIZE 32</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
      <div className="row">
        <div className="col-12">
          <div className="card bg-faded">
            <div className="card-header">Return Policy</div>
            <div className="card-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel
                mi sed est imperdiet tempus. Praesent ac ipsum lectus. In vel
                posuere nulla, eget mattis mi. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Vivamus
                nec ex sed risus feugiat sagittis. Vivamus egestas id neque
                auctor vulputate. Donec tincidunt, leo ut malesuada mattis,
                felis dolor lacinia enim, sit amet fermentum est turpis id
                augue. Vivamus rutrum aliquam ornare. Proin leo dolor, porta ut
                libero nec, ultricies tincidunt elit. Vivamus pharetra lacus
                augue, ut sagittis velit pellentesque vitae.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductContext from "../context/ProductContext";

export const ProductForm = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, POST, PUT, DELETE } = useContext(ProductContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const product = products?.find((product) => product.id === id);
  const [deleted, setDeleted] = useState(false);
  const onDelete = (e) => {
    e.preventDefault();
    DELETE({
      id,
      name,
      price,
    });
    setDeleted(true);
  };
  const onSubmit = (e) => {
    // if (!event | !content | !total | !present) {
    //   alert("Je moet een evenement kiezen");
    //   return;
    // }
    e.preventDefault();
    if (decla) {
      PUT(
        {
          id,
          name,
          price,
        },
        sendBlob
      );
      navigate(-1);
    } else {
      POST({
        name,
        price,
      });
    }
    setDeleted(false);
  };
  return (
    <>
      <div className="columns">
        <div className="column is-half is-offset-3">
          <form>
            <table>
              <tbody>
                <tr>
                  <th>
                    <label htmlFor="id_name">Name:</label>
                  </th>
                  <td className="field">
                    <input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      name="name"
                      value={name ? name : product?.name}
                      step="any"
                      className="input"
                      required
                      id="id_name"
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <label htmlFor="id_price">Price:</label>
                  </th>
                  <td className="field">
                    <input
                      type="number"
                      onChange={(e) => setPrice(e.target.value)}
                      name="price"
                      value={price ? price : product?.price}
                      step="any"
                      className="input"
                      required
                      id="id_price"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </>
  );
};
export default ProductForm;

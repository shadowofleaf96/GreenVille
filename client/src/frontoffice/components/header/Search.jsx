import { useState, useEffect, useRef } from "react";
import Iconify from "../../../backoffice/components/iconify";
import { Dropdown } from "react-bootstrap";
import "./Search.scss";

import { useRouter } from "../../../routes/hooks";
import axios from "axios";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (keyword.trim()) {
          setLoading(true);

          const response = await axios.get(
            `/v1/products/search?searchQuery=${keyword}`
          );

          setSearchResults(response.data.data);
          setShowResults(true);
        } else {
          setSearchResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchData, 300);

    return () => clearTimeout(debounceTimeout);
  }, [keyword, setSearchResults]);

  const searchHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      router.push(`/products/search/${keyword}`);
      setShowResults(false);
    }
  };

  const handleSelectProduct = (product) => {
    router.push(`/product/${product._id}`);
    setShowResults(false);
  };

  return (
    <div ref={searchRef}>
      <form onSubmit={searchHandler}>
        <div className="d-flex align-items-center">
          <input
            type="text"
            id="search_field"
            placeholder="Enter Product Name ..."
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button id="search_btn">
            <Iconify
              icon="material-symbols-light:search-rounded"
              width={24}
              height={24}
            />
          </button>
        </div>
      </form>

      {loading}

      {showResults && (
        <div className="text-center">
          <Dropdown.Menu show className="dropdown-menu-center">
            {searchResults.map((product) => (
              <Dropdown.Item
                key={product._id}
                onClick={() => handleSelectProduct(product)}
              >
                {product.product_name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </div>
      )}
    </div>
  );
};
export default Search;

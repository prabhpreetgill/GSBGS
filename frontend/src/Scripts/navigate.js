import { useNavigate } from "react-router-dom";

// Function to handle navigation

const navigate = (where) => () => {
  let navigate = useNavigate();

  navigate(where);
};

export default navigate;

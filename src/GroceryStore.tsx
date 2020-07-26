import React from "react";
// import { map } from "rxjs/operators";
import Delete from "./Delete";
import Check from "./Check";
import Update from "./Update";
import "./GroceryStore.css";
import axios from "axios";

interface props {
  inputProductRef?: HTMLInputElement;
}

export default class GroceryStore extends React.Component<props> {
  private inputProductRef: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    this.inputProductRef = React.createRef();
  }

  state = {
    product: "",
    amount: "",
    information: "",
    groceryData: [],
    updateOpen: false,
    updateId: "",
  };

  updateItem = (itemId: any) => {
    console.log(itemId);
    console.log("exectuedddd");
    this.setState({
      updateOpen: !this.state.updateOpen,
      updateId: itemId,
    });
  };

  componentDidMount() {
    console.log("componentdidmount");
    this.fetchData();
  }

  clearState = () => {
    this.setState({
      product: "",
      amount: "",
      information: "",
    });
  };

  triggerFetchData = () => {
    console.log("triggerfetchdata");
    this.fetchData();
  };

  fetchData() {
    console.log("fecthdata");
    let url: string = "";

    if (process.env.NODE_ENV === "development") {
      url = "http://localhost:5000/groceryitems";
    }
    if (process.env.NODE_ENV === "production") {
      url = "https://myitinerariestravelapp.herokuapp.com/groceryitems";
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const groceryData = data;
        this.setState({ groceryData: groceryData });
        console.log(groceryData, "data fetched");
      })
      .catch((error) => {
        const errorMessage: String = error.message;
        console.log(errorMessage);
      });
  }

  deleteAll = () => {
    if (window.confirm("Are you sure you wish to delete all items?")) {
      let url: string = "";

      if (process.env.NODE_ENV === "development") {
        url = "http://localhost:5000/groceryitems/deleteall";
      }
      if (process.env.NODE_ENV === "production") {
        url =
          "https://myitinerariestravelapp.herokuapp.com/groceryitems/deleteall";
      }

      const body = {};

      axios
        .get(url, body)
        .then((res) => {
          console.log(res);
          this.fetchData();
        })

        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  catchEnterEvent = (e: any) => {
    if (e.key === "Enter") {
      this.catchInput(e);
      if (null !== this.inputProductRef.current) {
        this.inputProductRef.current.focus();
      }
    }
  };

  catchInput = (e: any) => {
    if (this.state.product === "" || this.state.amount === "") {
      alert("please fill in product and amount fields!");
    } else {
      let groceryData = this.state;
      let product = groceryData.product;
      let amount = groceryData.amount;
      let information = groceryData.information;

      e.preventDefault();

      let url: string = "";

      if (process.env.NODE_ENV === "development") {
        url = "http://localhost:5000/groceryitems";
      }
      if (process.env.NODE_ENV === "production") {
        url = "https://myitinerariestravelapp.herokuapp.com/groceryitems";
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({
        product,
        amount,
        information,
      });

      axios
        .post(url, body, config)
        .then((res) => {
          this.fetchData();
          this.clearState();
        })

        .catch((err) => {
          console.log(err.response);
        });
    }
    if (null !== this.inputProductRef.current) {
      this.inputProductRef.current.focus();
    }
  };

  addInput = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    let groceryData: any = this.state.groceryData;

    let itemToDisplay = groceryData.map((item: any) => {
      return (
        <div className="grocerystore-positioner" key={item._id}>
          <div className="grocerystore-product-data">{item.product}</div>{" "}
          {item._id === this.state.updateId ? (
            <div className="grocerystore-product-update">
              <input></input>
            </div>
          ) : null}
          <div className="grocerystore-amount-data">{item.amount}</div>
          {item._id === this.state.updateId ? (
            <div className="grocerystore-amount-update">
              <input></input>
            </div>
          ) : null}
          <div className="grocerystore-information-data">
            {item.information}
          </div>{" "}
          {item._id === this.state.updateId ? (
            <div className="grocerystore-information-update">
              <input></input>
            </div>
          ) : null}
          <div className="grocerystore-delete">
            <Delete id={item._id} triggerFetchdata={this.triggerFetchData} />
          </div>
          <div className="grocerystore-check">
            <Check id={item._id} />
          </div>
          <div className="grocerystore-update">
            <Update updateItem={this.updateItem} id={item._id} />
          </div>
        </div>
      );
    });

    return (
      <div className="grocerystore-wrapper">
        <div className="grocerystore-grid">
          <div onClick={this.catchInput} className="grocerystore-add-item">
            Add Item
          </div>
          <div className="grocerystore-product  grocerystore-header">
            Product
          </div>
          <div className="grocerystore-product-input">
            <input
              name="product"
              onChange={(e: any) => this.addInput(e)}
              type="text"
              placeholder="type the product here"
              required
              value={this.state.product}
              ref={this.inputProductRef}
            />
          </div>
          <div className="grocerystore-amount  grocerystore-header">Amount</div>
          <div className="grocerystore-amount-input">
            <input
              name="amount"
              onChange={(e: any) => this.addInput(e)}
              type="text"
              placeholder="type the amount here"
              required
              value={this.state.amount}
            />
          </div>
          <div className="grocerystore-extra-info  grocerystore-header">
            Extra info
          </div>
          <div className="grocerystore-extra-info-input">
            <input
              name="information"
              onChange={(e: any) => this.addInput(e)}
              onKeyDown={this.catchEnterEvent}
              type="text"
              placeholder="type extra info here"
              required
              value={this.state.information}
            />
          </div>
          <div className="grocerystore-positioner ">{itemToDisplay}</div>
          <div onClick={this.deleteAll} className="grocerystore-delete-all">
            Delete all
          </div>
        </div>
      </div>
    );
  }
}

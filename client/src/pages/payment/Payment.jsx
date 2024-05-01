import { Button, Input, Modal, Select, Result } from "antd";
import { useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

import "./payment.scss";
const { v4: uuid4 } = require("uuid");

function Payment() {
  const [modal, setModal] = useState({
    open: false,
    success: false,
    error: false,
  });
  const [input, setInput] = useState({
    fName: "",
    lName: "",
    email: "",
    pNumber: "",
    amount: "",
    currency: "ETB",
  });
  const [isLoading, setIsLoading] = useState(false);

  const acceptPayment = () => {
    const tx_ref = uuid4();
    setIsLoading(true);
    fetch("http://localhost:8800/api/payment", {
      method: "POST",
      body: JSON.stringify({
        amount: 40,
        currency: input.currency,
        email: input.email,
        first_name: input.fName,
        last_name: input.lName,
        phone_number: input.pNumber,
        tx_ref: tx_ref,
      }),
      headers: {
        token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setInput({
          fName: "",
          lName: "",
          email: "",
          pNumber: "",
          amount: "",
          currency: "ETB",
        });
        if (res.success) {
          console.log("Response", res);
          setModal({ ...modal, success: true, open: false });
          setTimeout(() => {
            window.location.href = JSON.parse(
              res.success.body
            ).data.checkout_url;
          }, 5000);
        } else {
          console.log("Error", res);
          setModal({ ...modal, error: true, open: false });
        }
      })
      .catch((err) => {
        console.log("Error", err);
        setModal({ ...modal, error: true, open: false });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    acceptPayment();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  return (
    <>
      <div className="container_pay">
        <button className="pay-button" onClick={() => setModal({ open: true })}>
          <div className="image-container">
            <img
              src="https://th.bing.com/th/id/R.10f6b9b705e4b7db5b77b6ec2cc3393b?rik=GyuDgur7ioU%2fJA&pid=ImgRaw&r=0"
              alt=""
            />
            <span className="text-bottom">Chapa</span>
          </div>
        </button>
        <button
          className="pay-button"
          onClick={() => setModal({ open: false })}
        >
          <div className="image-container">
            <img
              src="https://th.bing.com/th/id/R.018b2cff576cdd643dbbc8462a94f77a?rik=6kQSRP8Q3MjEvA&pid=ImgRaw&r=0"
              alt=""
            />
            <span className="text-bottom"></span>
          </div>
        </button>

        <Modal
          title={<p className="text-center fs-5 m-0">Payment Details</p>}
          open={modal.open}
          maskClosable={false}
          footer={[
            <Button
              key="cancel"
              disabled={isLoading}
              onClick={() => {
                setModal({ open: false });
              }}
              type="primary"
              danger
            >
              Cancel
            </Button>,
            <Button
              key="ok"
              disabled={isLoading}
              onClick={() => {
                document.getElementById("submit").click();
              }}
              type="primary"
            >
              Ok
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit}>
            <label htmlFor="fname">First Name</label>
            <Input
              name="fName"
              value={input.fName}
              onChange={handleChange}
              prefix={<UserOutlined className="site-form-item-icon" />}
              id="fname"
            />
            <label htmlFor="lname">Last Name</label>
            <Input
              name="lName"
              value={input.lName}
              onChange={handleChange}
              prefix={<UserOutlined className="site-form-item-icon" />}
              id="lnane"
            />
            <label htmlFor="email">Email</label>
            <Input
              name="email"
              value={input.email}
              onChange={handleChange}
              type="email"
              prefix={<MailOutlined className="site-form-item-icon" />}
              id="email"
            />
            <label htmlFor="pnm">Phone Number</label>
            <Input
              name="pNumber"
              value={input.pNumber}
              onChange={handleChange}
              type="tel"
              required
              prefix={<PhoneOutlined className="site-form-item-icon" />}
              id="amt"
            />
            <label htmlFor="pnm">Amount</label>
            <Input
              name="amount"
              value="40"
              onChange={handleChange}
              type="number"
              prefix={<MoneyCollectOutlined />}
              min="1"
              id="pnm"
              required
            />
            <label htmlFor="curr">Currency</label>
            <Select
              style={{ width: "100%" }}
              className="d-block"
              defaultValue="ETB"
              id="curr"
              options={[
                { value: "ETB", label: "ETB" },
                { value: "USD", label: "USD" },
              ]}
              onChange={(value) => {
                setInput({ ...input, currency: value });
              }}
            />
            <button
              id="submit"
              hidden
              htmltype="submit"
              type="primary"
            ></button>
          </form>
        </Modal>
        <Modal
          title={<p className="text-center fs-5 m-0">Success</p>}
          open={modal.success}
          closable={false}
          footer=""
        >
          <Result
            status="success"
            title="Successfully Uploaded Payment Details"
            subTitle="You will be redirected to the payment page"
          />
        </Modal>
        <Modal
          title={<p className="text-center fs-5 m-0">Error</p>}
          open={modal.error}
          closable={true}
          maskClosable={true}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setModal({ ...modal, error: false });
              }}
              type="primary"
              danger
            >
              Cancel
            </Button>,
            <Button
              key="ok"
              onClick={() => {
                setModal({ ...modal, error: false });
              }}
              type="primary"
            >
              Continue
            </Button>,
          ]}
        >
          <Result status="error" title="Error Uploading Payment Details" />
        </Modal>
      </div>
    </>
  );
}

export default Payment;

"use client";
import { Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
// import { useOrder } from "../context/OrderContext";
import { HandleCheckout } from "../fetch/ApiCalls";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { CheckoutAlert } from "./CheckoutAlert";
import Cookies from "js-cookie";
import { api } from "@/utils/index.api";
export default function CardPay() {
  const [open2, setOpen2] = useState(true);
  const [res2, setRes2] = useState<OrderRes>();
  // const handleClickOpen = () => {
  //   setOpen2(true);
  // };
  const handleClose2 = () => {
    setOpen2(false);
    // setOrderSubmitted(false);
  };
  // const { order } = useOrder()
    const [totalCost, setTotalCost] = useState(0);
    const [items, setItems] = useState<any>([]);
    const getUser = () => {
      const userCookie = Cookies.get("UserAuth");
      return userCookie ? JSON.parse(userCookie) : null;
    };
      const [user] = useState<any>(getUser);
    useEffect(() => {
      const fetchCartDetails = async () => {
        try {
          const data = await api.getCart(user.id);
          setItems(data);
        } catch (error) {
          console.log("ERROR:", error);
        }
      };
  
      fetchCartDetails();
    }, [user?.id]);
  
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderStatus, setOrderStatus] = useState(["", ""]);

  const [data, setData] = useState({
    email: "",
    CardNbr: "",
    cardExperDay: "",
    CardCvc: "",
    CardholderName: "",
    Zip: "",
  });
  const [errors, setErrors] = useState<Partial<typeof data>>({});

  function formValidator(name: string, value: string) {
    // ===================== VALIDATE EMAIL =====================
    if (name === "email") {
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Required",
        }));
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Your email is incomplete.",
        }));
      }
    }

    // ===================== VALIDATE Card information =====================

    // check the CardNbr
    else if (name === "CardNbr") {
      const isValidCardNbr = /^\d{16}$/.test(value); // Check if numericValue has exactly 16 digits
      const isDigit = /^\d+$/.test(value);

      // console.log(value.length, " ", value);
      if (value.length == 0) {
        setData((prevData) => ({
          ...prevData,
          ["CardNbr"]: "",
        }));
      }
      if (value.length > 16 || (!isDigit && value)) {
        return -1;
      }
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          CardNbr: "Required",
        }));
      } else if (!isValidCardNbr) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          CardNbr: " Card information Incorrect",
        }));
      }
    }

    // check the cardExperDay
    else if (name === "cardExperDay") {
      const isValidCardNbr = /^\d{4}$/.test(value); // Check if numericValue has exactly 16 digits
      const isDigit = /^\d+$/.test(value);

      // console.log(value.length, " ", value);
      if (value.length == 0) {
        setData((prevData) => ({
          ...prevData,
          ["cardExperDay"]: "",
        }));
      }
      if (value.length > 4 || (!isDigit && value)) {
        return -1;
      }
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          cardExperDay: "Required",
        }));
      } else if (!isValidCardNbr) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          cardExperDay: " Card information Incorrect",
        }));
      }
    }

    // check the CardCvc
    else if (name === "CardCvc") {
      const isValidCardNbr = /^\d{3}$/.test(value); // Check if numericValue has exactly 16 digits
      const isDigit = /^\d+$/.test(value);

      // console.log(value.length, " ", value);
      if (value.length == 0) {
        setData((prevData) => ({
          ...prevData,
          ["CardCvc"]: "",
        }));
      }
      if (value.length > 3 || (!isDigit && value)) {
        return -1;
      }
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          CardCvc: "Required",
        }));
      } else if (!isValidCardNbr) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          CardCvc: " Card information Incorrect",
        }));
      }
    }

    // ===================== VALIDATE CardholderName =====================
    else if (name === "CardholderName") {
      // console.log(value.length, " ", value);
      if (value.length == 0) {
        setData((prevData) => ({
          ...prevData,
          ["CardholderName"]: "",
        }));
      }
      if (value.length > 30) {
        return -1;
      }
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          CardholderName: "Required",
        }));
      }
    }
    // ===================== VALIDATE Zip =====================
    else if (name === "Zip") {
      // console.log(value.length, " ", value);
      if (value.length == 0) {
        setData((prevData) => ({
          ...prevData,
          ["Zip"]: "",
        }));
      }
      if (value.length > 30) {
        return -1;
      }
      if (!value) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Zip: "Required",
        }));
      }
    }
  }

  function onHandleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    // Validate inputs here and set error if necessary
    const status = formValidator(name, value);
    if (status === -1) {
      return;
    }

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // check for errors
    formValidator("email", data.email);
    formValidator("CardNbr", data.CardNbr);
    formValidator("cardExperDay", data.cardExperDay);
    formValidator("CardCvc", data.CardCvc);
    formValidator("CardholderName", data.CardholderName);
    formValidator("Zip", data.Zip);
    const hasErrors = Object.values(errors).some((error) => !!error);
    if (hasErrors) {
      console.error("Form is not complete!");
      return;
    }
    // console.log("==========> FORM OK");

    const customer: Customer = {
      name: data.CardholderName,
      email: data.email,
      // address: data.Zip + selectedCountry,
    };

    const paymentMethod: PaymentMethod = {
      cardNumber: data.CardNbr,
      expirationDate: data.cardExperDay,
      cvv: data.CardCvc,
      type: "visa-card",
    };


    // console.log("==============2==============");
    // console.log(order);
    // console.log(orderTmp);
    // console.log("===============1=============");
    const myData: CheckoutPayload = {
      customer:user,
      paymentMethod,
    };
    const res = await HandleCheckout(myData);
    return res;
  }

  const { mutate } = useMutation({
  mutationFn: async () => handleSubmit(new Event("submit") as any),


    onSuccess: (res) => {
      setRes2(res);
      if (res.status === "Ok") {
        setOrderStatus(["Ok", "text-green-500"]);
        setData({
          email: "",
          CardNbr: "",
          cardExperDay: "",
          CardCvc: "",
          CardholderName: "",
          Zip: "",
        });
      } else if (res.status === "Not enough") {
        setOrderStatus(["No enough money on this card.", "text-orange-500"]);
        setTimeout(() => {
          setOrderSubmitted(false);
        }, 6000);
      } else {
        setOrderStatus(["Card is Not valid!", "text-red-500"]);
        setTimeout(() => {
          setOrderSubmitted(false);
        }, 6000);
      }
      // console.log(res);
      setOrderSubmitted(true);
      setOpen2(true);

      // console.log("data", data);
    },
  });

  // handle countries popover
  const [selectedCountry, setSelectedCountry] = useState("Morocco");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (item: string) => {
    setSelectedCountry(item);
    handleClose();
  };

  const countriesList = [
    "Morocco",
    "United States",
    "Canada",
    "China",
    "Mexico",
    "Brazil",
    "Argentina",
    "United Kingdom",
    "France",
    "Germany",
    "Spain",
    "Italy",
    "Russia",
    "China",
    "Japan",
    "India",
    "Australia",
    "South Africa",
    "Nigeria",
    "Egypt",
    "Ethiopia",
    "Kenya",
    "Saudi Arabia",
    "Turkey",
    "South Korea",
    "Indonesia",
    "Thailand",
    "Vietnam",
    "New Zealand",
    "Greece",
    "Sweden",
    "Norway",
    "Switzerland",
  ];
  return (
    <div>
      <form
        className="flex flex-col font-light text-black"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form submission behavior
          mutate(); // Call the mutation function
        }}
        noValidate
      >
        {/* ============== Email ============== */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="  mb-2 text-sm flex flex-row justify-between"
          >
            <p>Email</p>
            {errors.email === "Required" && (
              <p className="text-red-500 text-xs font-light">
                {errors.email.toUpperCase()}
              </p>
            )}
          </label>

          <input
            onChange={onHandleChange}
            value={data.email}
            name="email"
            type="email"
            id="email"
            required
            placeholder="email@example.com"
            className={`${
              errors.email ? "border-red-500 text-red-500" : "border-gray-400"
            } bg-white border   placeholder-[#9CA2A]  text-sm rounded-lg block w-full p-2.5 outline-none`}
          />
          {errors.email && errors.email !== "Required" && (
            <p className="text-red-500 font-normal text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>
        {/* ========================================== */}

        {/*============== Card information ============== */}
        <div>
          <label
            htmlFor="CardNbr"
            className="  mb-2 text-sm flex flex-row justify-between"
          >
            <p> Card information</p>
            {(errors.CardNbr === "Required" ||
              errors.cardExperDay === "Required" ||
              errors.CardCvc === "Required") && (
              <p className="text-red-500 text-xs font-light">REQUIRED</p>
            )}
          </label>
          <input
            onChange={onHandleChange}
            value={data.CardNbr}
            name="CardNbr"
            type="text"
            id="CardNbr"
            required
            placeholder="1234 1234 1234 1234"
            className={`${
              errors.CardNbr
                ? "border-red-500 text-red-500 border-b-1"
                : "border-gray-400 border-b-0"
            } bg-white border  border-gray-400 placeholder-[#9CA2A]  text-sm rounded-t-lg block w-full p-2.5 outline-none`}
          />
        </div>
        <div className="flex flex-row ">
          <input
            onChange={onHandleChange}
            value={data.cardExperDay}
            name="cardExperDay"
            type="text"
            required
            placeholder="MM / YY"
            className={`${errors.CardNbr ? "border-t-0" : ""} ${
              errors.CardCvc ? "border-r-0 " : ""
            } ${
              errors.cardExperDay
                ? "border-red-500 text-red-500 border-b-1"
                : ""
            } bg-white border border-gray-400 placeholder-[#9CA2A]  text-sm rounded-bl-lg block w-1/2 p-2.5 outline-none`}
          />
          <input
            onChange={onHandleChange}
            value={data.CardCvc}
            name="CardCvc"
            type="text"
            required
            placeholder="CVC"
            className={`${errors.CardNbr ? "border-t-0 " : ""}  ${
              errors.CardCvc
                ? "border-red-500 text-red-500 border-l-1"
                : "border-l-0"
            } bg-white border  border-gray-400 placeholder-[#9CA2A]  text-sm rounded-br-lg block w-1/2 p-2.5 outline-none`}
          />
        </div>
        {((errors.CardNbr && errors.CardNbr !== "Required") ||
          (errors.cardExperDay && errors.cardExperDay !== "Required") ||
          (errors.CardCvc && errors.CardCvc !== "Required")) && (
          <p className="text-red-500 font-normal text-sm mt-1">
            Card information Incorrect
          </p>
        )}
        {/* ========================================== */}

        {/*============== CardholderName ============== */}
        <div className="my-6">
          <label
            htmlFor="CardholderName"
            className="  mb-2 text-sm flex flex-row justify-between"
          >
            <p>Cardholder name</p>
            {errors.CardholderName === "Required" && (
              <p className="text-red-500 text-xs font-light">
                {errors.CardholderName.toUpperCase()}
              </p>
            )}
          </label>
          <input
            onChange={onHandleChange}
            value={data.CardholderName}
            name="CardholderName"
            type="text"
            id="CardholderName"
            required
            placeholder="Full name on card"
            className={`${
              errors.CardholderName
                ? "border-red-500 text-red-500"
                : "border-gray-400"
            } bg-white border   placeholder-[#9CA2A]  text-sm rounded-lg block w-full p-2.5 outline-none`}
          />
        </div>
        {/* ========================================== */}

        <div className="mb-6">
          {/*============== Country ============== */}

          <label
            htmlFor="Zip"
            className="  mb-2 text-sm flex flex-row justify-between"
          >
            <p>Country or region</p>
            {errors.Zip === "Required" && (
              <p className="text-red-500 text-xs font-light">
                {errors.Zip.toUpperCase()}
              </p>
            )}
          </label>
          <button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            className="flex flex-row justify-between items-center cursor-pointer bg-white border border-b-0 w-full px-2.5  py-1 border-gray-400  rounded-t-lg"
          >
            <p className="text-sm text-black">{selectedCountry}</p>
            <RiArrowDropDownLine className="text-3xl" />
          </button>

          <Menu
            sx={{ width: 620 }}
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div className="h-36 w-96 max-w-[32rem]">
              {countriesList.map((item, index) => (
                <MenuItem key={index} onClick={() => handleMenuItemClick(item)}>
                  {item}
                </MenuItem>
              ))}
            </div>
          </Menu>

          {/* ========================================== */}

          {/*============== Zip ============== */}

          <input
            onChange={onHandleChange}
            value={data.Zip}
            name="Zip"
            type="text"
            id="Zip"
            required
            placeholder="ZIP"
            className={`${
              errors.Zip ? "border-red-500 text-red-500" : "border-gray-400"
            } bg-white border   placeholder-[#9CA2A]  text-sm rounded-b-lg block w-full p-2.5 outline-none`}
          />
          {/* ========================================== */}
        </div>

        <button
          type="submit"
          className="bg-blue-950 text-gray-300  font-medium py-2.5 px-5 mt-4 mb-6 rounded-lg w-full"
        >
          Checkout
        </button>
        {orderSubmitted && orderStatus[0] === "Ok" && (
          <CheckoutAlert response={res2!} open={open2} onClose={handleClose2} />
        )}
        {orderSubmitted && orderStatus[0] !== "Ok" && (
          <p className={`${orderStatus[1]} text-sm mt-2 animate-bounce `}>
            {orderStatus[0]}
          </p>
        )}
      </form>
    </div>
  );
}


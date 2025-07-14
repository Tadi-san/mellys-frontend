"use client";
import { Dialog } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { FaCircleCheck } from "react-icons/fa6";
import Link from "next/link";
import JsonViewer from "./JsonViewer";
export interface SimpleDialogProps {
  response: OrderRes;
  open: boolean;
  onClose: () => void;
}

export function CheckoutAlert(props: SimpleDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };
  // console.log("props.response.checkoutPayload", props.response.checkoutPayload);

  return (
    <Dialog onClose={handleClose} open={open}>
      <div className="w-96 h-fit sm:w-[34rem] flex flex-col justify-center sm:py-8 sm:px-4 py-6 px-2 sm:pt-0">
        {/* the head of dialog */}

        <div className="flex flex-col w-full items-end sm:my-4 mr-4">
          <RxCross2
            onClick={handleClose}
            className="text-gray-400 hover:text-black text-2xl cursor-pointer  "
          />
        </div>
        <FaCircleCheck className="mx-auto text-7xl sm:text-8xl text-green-500" />
        <h1 className="mx-auto text-2xl text-green-500 mt-4 mb-4">
          Payment successful
        </h1>

        {/* the content of dialog */}
        <div>
          <JsonViewer data={props.response.checkoutPayload} />
        </div>
        <div className="flex flex-row w-full mt-4">
          <Link
            target="_blank"
            href={"https://github.com/hixcoder/hix_CheckoutPage"}
            className="bg-gray-600 hover:bg-gray-500 text-white font-light py-2.5 px-5  rounded-lg w-[40$] sm:w-1/3 mx-auto my-auto text-center"
          >
            Read Docs
          </Link>
          <Link
            target="_blank"
            href={"https://www.hixcoder.me/"}
            className="bg-green-600 hover:bg-green-500 text-white  font-light py-2.5 px-5  rounded-lg w-[40$] sm:w-1/3 mx-auto my-auto text-center"
          >
            Check Product
          </Link>
        </div>
        {/* /the content of dialog */}
      </div>
    </Dialog>
  );
}

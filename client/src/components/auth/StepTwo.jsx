/* eslint-disable react/prop-types */

import { Mail } from "lucide-react";
import { verifyOTPControl } from "@/config";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import InputForm from "@/components/form/InputForm";
import InputButton from "@/components/form/InputButton";

const StepTwo = ({ registerForm }) => {
  const { resendOTP } = useAuthStore();
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (countdown === 0) {
      setIsResendDisabled(false);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendOTP = () => {
    resendOTP(registerForm.values.email);
    setIsResendDisabled(true);
    setCountdown(countdown + 30);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex justify-center">
          <Mail size={40} />
        </div>

        <div className="text-center">
          <h5>Enter Verification Code</h5>
          <div>Your verification code has been sent to:</div>
          <span>{registerForm.values.email}</span>
        </div>
      </div>
      <div className="flex flex-col space-y-4 items-center justify-center">
        <InputForm formik={registerForm} formControl={verifyOTPControl}>
          <InputButton title={"Submit"} formik={registerForm} />
        </InputForm>
        <div className="text-sm">
          {countdown > 0 ? (
            <span>
              Please wait <b>{countdown}s</b> to resend code
            </span>
          ) : (
            <span>
              Did not receive the code?{" "}
              <button
                className="text_button"
                type="button"
                onClick={handleResendOTP}
                disabled={isResendDisabled}
              >
                Resend
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepTwo;

"use client";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkoutSchema } from "@/lib/checkoutSchema";
import { Toaster, toast } from "sonner";
import { ShoppingBag } from "lucide-react";

type FormData = z.infer<typeof checkoutSchema>;

export interface CheckoutFormRef {
  reset: () => void;
  focus: (field: keyof FormData) => void;
  validate: () => Promise<boolean>;
}

const CheckoutForm = forwardRef<CheckoutFormRef>((_, ref) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    setFocus,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
  });

  useImperativeHandle(ref, () => ({
    reset: () => reset(),
    focus: (field: keyof FormData) => setFocus(field),
    validate: async () => trigger(),
  }));

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);

    toast.success("Purchase completed successfully!");

    reset();
  };

  const handleEnterKey = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentField: keyof FormData,
    nextField: keyof FormData
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFocus(nextField);
      //   const isValid = await trigger(currentField);
      //   console.log("isValid", isValid);
      //   if (isValid) setFocus(nextField);
    }
  };

  return (
    <div className="max-w-4xl p-4">
      <Toaster
        position="top-center"
        richColors
        icons={{ success: <ShoppingBag /> }}
        gap={20}
      />
      <div className="flex w-full max-w-6xl rounded-lg bg-white">
        {/* Image Section */}
        <div className="hidden w-1/2 overflow-hidden rounded-l-lg lg:block">
          <div className="flex h-full items-center justify-center p-8">
            <img
              src="https://img.freepik.com/premium-vector/self-service-checkout-man-punches-goods-self-service-checkout-payment-by-card-supermarket-vector-illustration_273828-84.jpg"
              alt="Secure Payment"
              className="w-full rounded-lg object-cover"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Secure Checkout
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    {...register("cardNumber")}
                    placeholder="1234 5678 9012 3456"
                    onKeyDown={(e) =>
                      handleEnterKey(e, "cardNumber", "expiryDate")
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      const formattedValue =
                        value
                          .match(/.{1,4}/g) // Group digits into chunks of 4
                          ?.join(" ") || ""; // Add spaces between groups
                      e.target.value = formattedValue;
                    }}
                    className={`font-mono ${
                      errors.cardNumber ? "border-red-500" : ""
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="text-sm text-red-500">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      {...register("expiryDate")}
                      placeholder="MMYY"
                      onKeyDown={(e) => handleEnterKey(e, "expiryDate", "cvv")}
                      className={`font-mono ${
                        errors.expiryDate ? "border-red-500" : ""
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="text-sm text-red-500">
                        {errors.expiryDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      {...register("cvv")}
                      placeholder="123"
                      type="password"
                      onKeyDown={(e) => handleEnterKey(e, "cvv", "name")}
                      className={`font-mono ${
                        errors.cvv ? "border-red-500" : ""
                      }`}
                    />
                    {errors.cvv && (
                      <p className="text-sm text-red-500">
                        {errors.cvv.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="John Doe"
                    onKeyDown={(e) => handleEnterKey(e, "name", "email")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="john@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Country Select */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select onValueChange={(value) => setValue("country", value)}>
                    <SelectTrigger
                      id="country"
                      className={errors.country ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
});

export default CheckoutForm;

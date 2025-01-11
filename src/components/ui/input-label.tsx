import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from './label';


interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    type?: React.HTMLInputTypeAttribute | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: FieldErrors<any>;
    className?: string; 
    placeholder?: string;
    uppercase?: boolean;
}

export const InputLabel = ({
  name,
  label = "",
  type = "text",
  register,
  errors,
  className = '',
  uppercase = false,
    placeholder = '',
  ...rest // Props adicionales
}: IProps) => {
  return (
    <>
      <div className="space-y-1 w-full ">
        <Label
          htmlFor={"input-" + name}
          className={`${errors[name] ? "text-red-500 " : ""}`}
        >
          {label}
        </Label>
        <Input
          id={"input-" + name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          {...rest}
          className={`sm:!text-base text-muted-foreground dark:text-white h-11 border border-black ${
            uppercase ? "uppercase" : ""
          } placeholder:text-muted-foreground/50 ${
            errors[name]
              ? "border-red-500 focus-visible:ring-transparent font-normal"
              : "border-border"
          } ${className}`}
        />
        {errors[name] && typeof errors[name].message === "string" && (
          <p className="flex items-center gap-1 !mt-2  text-xs antialiased font-normal leading-normal text-red-500">
            {errors[name].message}
          </p>
        )}
      </div>
    </>
  );
};




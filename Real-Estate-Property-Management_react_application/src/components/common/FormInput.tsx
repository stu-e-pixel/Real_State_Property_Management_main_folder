import { TextField, MenuItem } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { ReactNode } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: string;
  select?: boolean;
  options?: Option[];
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  helperText?: ReactNode;
  slotProps?: TextFieldProps["slotProps"];
}

const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  select = false,
  options = [],
  multiline = false,
  rows = 4,
  disabled = false,
  helperText,
  slotProps,
}: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        
        console.log(`[FormInput:${name}] field:`, {
          name: field.name,
          value: field.value,
          valueType: typeof field.value,
          onChangeType: typeof field.onChange,
          refType: typeof field.ref,
        });

        return (
          <TextField
            {...field}
            fullWidth
            label={label}
            placeholder={placeholder}
            type={type}
            select={select}
            multiline={multiline}
            rows={multiline ? rows : undefined}
            error={!!error}
            helperText={error?.message ?? helperText}
            variant="outlined"
            disabled={disabled}
            slotProps={slotProps}
            sx={{ mb: 2 }}
          >
            {select &&
              options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
        );
      }}
    />
  );
};

export default FormInput;
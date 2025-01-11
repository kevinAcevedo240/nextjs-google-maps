"use client";

// React and Hooks
import React from "react";
import { useForm } from "react-hook-form";

// Validation
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LocateFixed } from "lucide-react";
import { Novedad } from "@/types";
import { InputLabel } from "@/components/ui/input-label";

const schema = yup.object({
    id: yup.string().nullable(),
    nombre: yup.string().required("El nombre de la novedad es requerido"),
    tipo: yup
        .string()
        .oneOf(
            [
                "Retrasos",
                "Incidentes en la Ruta",
                "Problemas Mecánicos",
                "Problemas con la Carga",
                "Problemas con el Conductor o Personal",
                "Factores Externos",
                "Tecnología y Comunicaciones",
                "Emergencias y Seguridad",
                "Cumplimiento Normativo",
                "Otros",
            ],
            "Tipo de novedad inválido"
        )
        .required("El tipo es requerido"),
    latitud: yup
        .number()
        .transform(
            (value, originalValue) => (originalValue === "" ? undefined : value) // Convierte cadena vacía a undefined
        )
        .required("La latitud es requerida")
        .min(-90, "La latitud debe estar entre -90 y 90")
        .max(90, "La latitud debe estar entre -90 y 90")
        .test("is-decimal", "La latitud debe ser un número decimal", (value) => {
            return value !== undefined && !isNaN(value);
        }),
    longitud: yup
        .number()
        .transform(
            (value, originalValue) => (originalValue === "" ? undefined : value) // Convierte cadena vacía a undefined
        )
        .required("La longitud es requerida")
        .min(-180, "La longitud debe estar entre -180 y 180")
        .max(180, "La longitud debe estar entre -180 y 180")
        .test("is-decimal", "La longitud debe ser un número decimal", (value) => {
            return value !== undefined && !isNaN(value);
        }),
    duracion: yup
        .string()
        .required("La duración es requerida")
        .matches(
            /^(\d{2}:){0,2}\d{2}$/,
            "Debe tener al menos un campo en formato válido (HH, MM, o SS)"
        )
        .test("is-valid-time", "Tiempo inválido", (value) => {
            if (!value) return true;
            const parts = value.split(":");
            return parts.every((part, index) => {
                const num = parseInt(part, 10);
                if (index === 0) return num >= 0 && num <= 23;
                return num >= 0 && num <= 59;
            });
        }),
});

// Helper para extraer las opciones de `oneOf`
const extractEnumOptions = <T,>(schema: yup.Schema<T>): string[] => {
  return (schema.describe().oneOf || []) as string[];
};

// Lista de opciones de tipo de novedad
const typeOptions = extractEnumOptions(
  schema.fields.tipo as yup.Schema<string>
);

const defaultValues: Novedad = {
  id: null,
  nombre: "",
  tipo: undefined as unknown as Novedad["tipo"],
  latitud: undefined as unknown as number,
  longitud: undefined as unknown as number,
  duracion: "",
};

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentNovedad?: Novedad;
  setCurrentNovedad: React.Dispatch<React.SetStateAction<Novedad | undefined>>;
  onGuardarNovedad: (novedad: Novedad) => void;
}

export const NovedadForm = ({
  setShowModal,
  currentNovedad,
  setCurrentNovedad,
  onGuardarNovedad,
}: IProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Novedad>({
    defaultValues: currentNovedad || defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: Novedad) => {
    const nuevaNovedad = {
        ...data,
        id: data.id || Date.now().toString(), // Generar un ID único si no existe
      };
  
    console.log(nuevaNovedad);
    setShowModal(false);
    setCurrentNovedad(nuevaNovedad);
    onGuardarNovedad(nuevaNovedad);
  };

  const valueButton = () => {
    if (currentNovedad?.id) {
      return "Actualizar";
    }
    return "Aceptar";
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Actualizar los campos de latitud y longitud
          setValue("latitud", latitude, { shouldValidate: false });
          setValue("longitud", longitude, { shouldValidate: false });
        },
        (error) => {
          // Manejo de errores específicos
          let errorMessage = "No se pudo obtener la ubicación. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Permisos de ubicación denegados. Por favor, actívalos.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage +=
                "La información de ubicación no está disponible.";
              break;
            case error.TIMEOUT:
              errorMessage += "El tiempo para obtener la ubicación expiró.";
              break;
            default:
              errorMessage += "Error desconocido.";
          }
          alert(errorMessage);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Opciones para mejorar la precisión
      );
    } else {
      alert("Tu navegador no soporta la geolocalización.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sm:mx-0 mx-4">
      <div className="space-y-4 gap-6 mt-[10px] sm:mt-0">
        <div className="lg:flex justify-center items-center gap-3 space-y-4 lg:space-y-0">
          <div className="space-y-1 w-full">
            <Label
              className={
                errors.tipo && typeof errors.tipo?.message === "string"
                  ? "text-red-500"
                  : ""
              }
            >
              Tipo de Novedad
            </Label>
            <Select
              onValueChange={(value: string) => {
                setValue("tipo", value as Novedad["tipo"], {
                  shouldValidate: true, // Valida inmediatamente después del cambio
                });
              }}
              defaultValue=""
            >
              <SelectTrigger
                className={
                  errors.tipo && typeof errors.tipo?.message === "string"
                    ? "border-red-500"
                    : "border-border"
                }
              >
                <SelectValue placeholder="Seleccionar tipo novedad" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((tipo: string) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipo && typeof errors.tipo?.message === "string" && (
              <p className="text-red-500 text-sm">{errors.tipo.message}</p>
            )}
          </div>
          <InputLabel
            name="nombre"
            label="Detalle"
            placeholder="Detalle de la novedad"
            register={register}
            errors={errors}
            type="text"
          />
        </div>
        <div className="lg:flex items-end gap-3 space-y-4 lg:space-y-0">
          <div className="flex gap-3 w-full">
            <InputLabel
              name="latitud"
              label="Latitud"
              placeholder="Latitud"
              register={register}
              errors={errors}
              type="text"
            />
            <InputLabel
              name="longitud"
              label="Longitud"
              placeholder="Longitud"
              register={register}
              errors={errors}
              type="text"
            />
          </div>
          <Button
            variant={"ghost"}
            className="dark:text-black  text-white text-lg p-3 sm:p-4 transition-all hover:scale-110 active:scale-95 rounded-lg dark:bg-white dark:hover:shadow-custom-white hover:bg-black hover:text-white shadow-custom-black bg-black"
            onClick={(e) => {
              e.preventDefault(); // Evitar que el botón dispare el submit del formulario
              handleGetLocation();
            }}
          >
            <LocateFixed className="mr-2 size-5 sm:size-7" />
            <span className="text-sm sm:text-base">Tu Ubicación</span>
          </Button>
        </div>

        <div className="md:flex justify-center items-center gap-3 space-y-4 md:space-y-0">
          <InputLabel
            register={register}
            errors={errors}
            name="duracion"
            label="Duración"
            placeholder="HH:MM:SS"
            type="text"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6 sm:mb-0 gap-4">
        <Button
          type="button"
          onClick={() => setShowModal(false)}
          variant={"ghost"}
        >
          Cancelar
        </Button>
        <Button type="submit" variant={"outline"}>
          {valueButton()}
        </Button>
      </div>
    </form>
  );
};

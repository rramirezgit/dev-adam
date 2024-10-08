import type { RootState } from 'src/store';

import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setErrors, updateValueInputNewsletter } from 'src/store/slices/newsletterStore';

import type { TagsInput } from '../types';

interface IuseValidate {
  maxLength?: number;
  minLength?: number;
  errorName?: string;
  templateId: string;
  inputId: string;
  name: string;
  type: string;
  variant: string;
  parentId?: string;
}

export default function useValidate({
  maxLength = 10000,
  minLength = 0,
  errorName = '',
  templateId,
  inputId,
  type,
  name,
  variant,
  parentId,
  ...props
}: IuseValidate) {
  const [validationSchema, setValidationSchema] = useState<any>();
  const distpatch = useDispatch();

  const currentNewsletter = useSelector((state: RootState) => state.newsletter.currentNewsletter);

  const errors = useSelector((state: RootState) => state.newsletter.errors);

  useEffect(() => {
    const nameInput = errorName || variant;

    setValidationSchema(
      Yup.string()
        .max(maxLength, `El ${nameInput} debe tener como máximo ${maxLength} caracteres`)
        .min(minLength, `El ${nameInput} debe tener como mínimo ${minLength} caracteres`)
    );
  }, []);

  const onValidText = (value: string) => {
    distpatch(updateValueInputNewsletter({ templateId, inputId, value, parentId }));
  };

  const onInvalidText = (err: any) => {
    let newErrors = [...errors];

    const currentInputHaveError = errors.some(
      (item) => item.inputId === inputId && item.name === name
    );

    if (currentInputHaveError) {
      /// si ya existe el error valido que sea el mismo mensaje de error
      const index = errors.findIndex((item) => item.inputId === inputId && item.name === name);

      if (errors[index].message !== err.message) {
        newErrors = errors.filter((item) => !(item.inputId === inputId && item.name === name));
      } else {
        return;
      }
    }

    if (type === 'tags') {
      const inputTags = currentNewsletter
        .find((item) => item.templateId === templateId)
        ?.inputs.find((item) => item.inputId === parentId) as TagsInput;

      const tags = inputTags?.tags || [];

      const index = tags.findIndex((item) => item.inputId === inputId) + 1;

      err.message = err.message.replace(
        `El ${errorName || variant}`,
        `El ${errorName || variant} ${index}`
      );
    }

    distpatch(
      setErrors([
        ...newErrors,
        {
          inputId,
          name,
          type: variant,
          message: err.message,
          templateId,
        },
      ])
    );
  };

  const handleChange = (value: string) => {
    if (validationSchema) {
      validationSchema
        .validate(value.replace(/<[^>]*>?/gm, '').trim())
        .then(() => {
          // limpiar errores
          distpatch(
            setErrors(
              errors.filter(
                (item) => !(item.inputId === inputId && item.name === name && item.type === variant)
              )
            )
          );
          onValidText(value);
        })
        .catch((err: any) => {
          onValidText(value);
          onInvalidText(err);
        });
    }
  };

  return { handleChange };
}

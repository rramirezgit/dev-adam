/* eslint-disable react/no-danger */
import './styles-bubble.css';

import type { RootState } from 'src/store';

import { useRef } from 'react';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';

import { Box } from '@mui/material';

import useValidate from './useValidate';
import { useStylesText } from './styles-text';
import { COLORS_NEWSLETTER_TEMPLATES } from '../../templates/template-layout';

import type { TagsInput, TextInput } from '../types';

interface props extends TextInput {
  parentId?: string;
}

export default function TextBubble({
  inputId,
  maxLength = 10000,
  minLength = 0,
  isEmail = false,
  templateId,
  disabled = false,
  ...props
}: props) {
  const { style, variant, name, placeholder, parentId } = props;

  const quillRef = useRef<any>(null);

  const stylesText = useStylesText();

  const { handleChange } = useValidate({
    inputId,
    maxLength,
    templateId,
    minLength,
    parentId,
    ...props,
  });

  const currentNewsletter = useSelector((state: RootState) => state.newsletter.currentNewsletter);

  let currentInput: any = currentNewsletter
    .find((item) => item.templateId === templateId)
    ?.inputs.find((item) => item.inputId === inputId) as TextInput;

  if (currentInput === undefined) {
    const layout = currentNewsletter
      .find((item) => item.templateId === templateId)
      ?.inputs.find((item) => item.inputId === parentId);

    if (layout?.type === 'layout') {
      currentInput = layout?.inputs.find((input: any) => input.inputId === inputId) as TextInput;
    } else if (layout?.type === 'tags') {
      const inputTags = currentNewsletter
        .find((item) => item.templateId === templateId)
        ?.inputs.find((item) => item.inputId === parentId) as TagsInput;

      currentInput = inputTags?.tags.find((item) => item.inputId === inputId);
    }
  }
  if (isEmail || disabled) {
    // if (true) {
    let html = '';

    if (variant === 'tags') {
      const inputTags = currentNewsletter
        .find((item) => item.templateId === templateId)
        ?.inputs.find((item) => item.inputId === parentId) as TagsInput;

      const currentTags = inputTags?.tags.find((item) => item.inputId === inputId);

      html = currentTags?.value as string;
      html = html?.replaceAll(/<p>/g, '<p style="margin: 0px; padding: 0px;text-align:center">');
    } else {
      html = currentInput?.value as string;
      html = html?.replaceAll(/<p><br><\/p>/g, '');
      html = html?.replaceAll(/<p>/g, '<p style="margin: 0px; padding: 0px;">');
      html = html?.replaceAll(
        /<p class="ql-align-right"/g,
        '<p style="margin: 0px; padding: 0px;text-align:right"'
      );

      html = html?.replaceAll(
        /<p class="ql-align-center"/g,
        '<p style="margin: 0px; padding: 0px;text-align:center"'
      );

      html = html?.replaceAll(
        /<p class="ql-align-justify"/g,
        '<p style="margin: 0px; padding: 0px;text-align:justify;font-size: 18px"'
      );

      html = html?.replaceAll(
        /<p class="ql-align-left"/g,
        '<p style="margin: 0px; padding: 0px;text-align:left"'
      );

      html = html?.replaceAll(
        /<p class="ql-indent-1"/g,
        '<p style="margin: 0px; padding: 0px;padding-left: 3em;"'
      );
    }
    return (
      <div
        style={{
          width: '100%',
        }}
      >
        <div
          style={stylesText[`${name}_${variant}`]}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </div>
    );
  }

  const toolbarOptions = [
    ['link'],
    [{ color: COLORS_NEWSLETTER_TEMPLATES }],
    [{ align: [] }],
    ['clean'],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  ];
  let currentText = currentInput?.value as string;

  if (currentInput) {
    currentText = currentText?.replaceAll(/<p><br><\/p><p><br><\/p>/g, '');
    currentText = currentText?.replaceAll(
      /<p class="ql-align-justify"><br><\/p><p class="ql-align-justify"><br><\/p>/g,
      ''
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        fontSize: '10px',
        ...style,
      }}
    >
      <ReactQuill
        ref={quillRef as any}
        modules={{
          toolbar: {
            container: toolbarOptions,
          },
        }}
        theme="bubble"
        placeholder={placeholder}
        style={{
          width: '100%',
          ...style,
        }}
        className={`quill-${variant}-${name}`}
        value={currentText}
        onChange={handleChange}
      />
    </Box>
  );
}

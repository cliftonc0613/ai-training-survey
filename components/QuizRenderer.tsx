'use client';

import { Stack } from '@mantine/core';
import type { Question } from '@/lib/types';
import MultipleChoice from './QuestionTypes/MultipleChoice';
import Checkbox from './QuestionTypes/Checkbox';
import RatingScale from './QuestionTypes/RatingScale';
import Dropdown from './QuestionTypes/Dropdown';
import SliderInput from './QuestionTypes/SliderInput';
import TextShort from './QuestionTypes/TextShort';
import TextLong from './QuestionTypes/TextLong';

interface QuizRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export default function QuizRenderer({ question, value, onChange, error }: QuizRendererProps) {
  // Handle different question types
  switch (question.type) {
    case 'multiple-choice':
      return (
        <MultipleChoice
          options={question.options || []}
          value={value}
          onChange={onChange}
          variant="list"
          required={question.required}
          error={error}
        />
      );

    case 'multiple-choice-cards':
      return (
        <MultipleChoice
          options={question.options || []}
          value={value}
          onChange={onChange}
          variant="cards"
          required={question.required}
          error={error}
        />
      );

    case 'checkbox':
      return (
        <Checkbox
          options={question.options || []}
          value={value || []}
          onChange={onChange}
          required={question.required}
          error={error}
          minSelection={question.minSelection}
          maxSelection={question.maxSelection}
        />
      );

    case 'rating':
      return (
        <RatingScale
          value={value}
          onChange={onChange}
          variant="stars"
          min={question.minRating || 1}
          max={question.maxRating || 5}
          required={question.required}
          error={error}
        />
      );

    case 'rating-numbers':
      return (
        <RatingScale
          value={value}
          onChange={onChange}
          variant="numbers"
          min={question.minRating || 1}
          max={question.maxRating || 10}
          required={question.required}
          error={error}
          labels={question.ratingLabels}
        />
      );

    case 'rating-slider':
      return (
        <RatingScale
          value={value}
          onChange={onChange}
          variant="slider"
          min={question.minRating || 1}
          max={question.maxRating || 10}
          required={question.required}
          error={error}
          labels={question.ratingLabels}
        />
      );

    case 'dropdown':
      return (
        <Dropdown
          options={question.options || []}
          value={value}
          onChange={onChange}
          placeholder={question.placeholder}
          required={question.required}
          error={error}
          searchable={question.searchable}
        />
      );

    case 'slider':
      return (
        <SliderInput
          value={value}
          onChange={onChange}
          min={question.minValue || 0}
          max={question.maxValue || 100}
          step={question.step || 1}
          marks={question.marks}
          labels={question.sliderLabels}
          required={question.required}
          error={error}
          showValue={question.showValue !== false}
        />
      );

    case 'text':
      return (
        <TextShort
          value={value || ''}
          onChange={onChange}
          placeholder={question.placeholder}
          required={question.required}
          error={error}
          minLength={question.minLength}
          maxLength={question.maxLength}
        />
      );

    case 'text-long':
      return (
        <TextLong
          value={value || ''}
          onChange={onChange}
          placeholder={question.placeholder}
          required={question.required}
          error={error}
          minLength={question.minLength}
          maxLength={question.maxLength}
          minRows={question.minRows}
          maxRows={question.maxRows}
        />
      );

    case 'yes-no':
      return (
        <MultipleChoice
          options={['Yes', 'No']}
          value={value}
          onChange={onChange}
          variant="list"
          required={question.required}
          error={error}
        />
      );

    default:
      return (
        <Stack>
          <p>Unsupported question type: {question.type}</p>
        </Stack>
      );
  }
}

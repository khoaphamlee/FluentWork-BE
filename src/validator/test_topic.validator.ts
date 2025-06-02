import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CreateTestDto } from 'src/tests/dto/create-test.dto';


@ValidatorConstraint({ name: 'TestTopicValidator', async: false })
export class TestTopicValidator implements ValidatorConstraintInterface {
  validate(dto: CreateTestDto, args: ValidationArguments) {
    const { type, vocabulary_topic, grammar_topic } = dto;

    if (type === 'Vocabulary') {
      return Array.isArray(vocabulary_topic) && vocabulary_topic.length > 0 && !grammar_topic;
    }

    if (type === 'Grammar') {
      return Array.isArray(grammar_topic) && grammar_topic.length > 0 && !vocabulary_topic;
    }

    if (type === 'Mixed') {
      return (
        Array.isArray(vocabulary_topic) &&
        vocabulary_topic.length > 0 &&
        Array.isArray(grammar_topic) &&
        grammar_topic.length > 0
      );
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid topic configuration:
- If type is 'Vocabulary', only 'vocabulary_topic' should be provided.
- If type is 'Grammar', only 'grammar_topic' should be provided.
- If type is 'Mixed', both 'vocabulary_topic' and 'grammar_topic' must be provided.`;
  }
}

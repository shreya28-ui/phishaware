'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const questions = [
  {
    question: 'What is the most reliable way to verify a link in an email?',
    options: [
      'Clicking on it to see where it goes.',
      'Hovering over it to see the URL preview.',
      'Trusting it if the email looks official.',
      'Calling the company to confirm.',
    ],
    answer: 'Hovering over it to see the URL preview.',
  },
];

export function Quiz() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const question = questions[0];
  const isCorrect = selectedOption === question.answer;

  const handleCheck = () => {
    if (selectedOption) {
      setShowResult(true);
    }
  };

  return (
    <Card className="bg-background/50">
      <CardHeader>
        <CardTitle>Test Your Knowledge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium">{question.question}</p>
        <RadioGroup onValueChange={setSelectedOption} disabled={showResult}>
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        
        {!showResult && (
          <Button onClick={handleCheck} disabled={!selectedOption}>Check Answer</Button>
        )}

        {showResult && (
          <div
            className={cn(
              'mt-4 rounded-md p-3 text-sm font-medium',
              isCorrect
                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
            )}
          >
            {isCorrect ? 'Correct! ' : 'Not quite. '}
            The best practice is to hover over links to preview the destination URL without clicking.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

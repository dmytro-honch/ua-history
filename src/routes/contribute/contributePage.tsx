import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  contributorName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  contributorEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  era: z.string('Please select an era.'),
  period: z.string().optional(),
  eventTitleUk: z.string().min(3, {
    message: 'Ukrainian title must be at least 3 characters.',
  }),
  eventTitleEn: z.string().min(3, {
    message: 'English title must be at least 3 characters.',
  }),
  startDate: z.string().min(1, {
    message: 'Start date is required.',
  }),
  endDate: z.string().optional(),
  location: z.string('Please select a location.'),
  descriptionUk: z.string().min(10, {
    message: 'Ukrainian description must be at least 10 characters.',
  }),
  descriptionEn: z.string().min(10, {
    message: 'English description must be at least 10 characters.',
  }),
  sources: z.string().min(10, {
    message: 'Please provide at least one source URL.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function ContributePage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contributorName: '',
      contributorEmail: '',
      eventTitleUk: '',
      eventTitleEn: '',
      startDate: '',
      endDate: '',
      descriptionUk: '',
      descriptionEn: '',
      sources: '',
    },
  });

  function onSubmit(values: FormValues) {
    // This will send data to an external service (to be implemented)
    console.log('Form submission:', values);
    form.reset();
  }

  return (
    <div className="page__content--fixed">
      <div>
        <h1>Contribute to the Project</h1>
        <p>
          Help us build the most comprehensive Ukrainian history library by submitting historical events. Your contribution will be reviewed and added to the
          database.
        </p>
      </div>

      <div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h2>Contributor Information</h2>

          <div>
            <button type="submit">Submit Contribution</button>
            <button type="button" onClick={() => form.reset()}>
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

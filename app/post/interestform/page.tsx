'use client';
import { useState, FormEvent } from 'react';
import { useSubmitInterest, InterestPost } from '../../hooks/useSubmitInterest';
import { useQuery } from '@tanstack/react-query';
import Link from "next/link";

export default function InterestForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ form?: string }>({});

  const mutation = useSubmitInterest();

  // Query to get current interest count
const countQuery = useQuery({
  queryKey: ['interestCount'],
  queryFn: () => 0, // start from 0
  initialData: 0,
});



  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !message) {
      setErrors({ form: 'Please fill out all fields before submitting.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ form: "Please include a valid email address." });
      return;
    }

    setErrors({});

    const newPost: InterestPost = { name, email, message };

    // Trigger the mutation
    mutation.mutate(newPost);

    // Reset form fields
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="interest-card-container">
      <div className="interest-card">
        <h2>Express Your Interest</h2>

        <Link href="/post">Go Next</Link>

        <p className="description">
          Fill out the form below and we will get back to you!
        </p>

        {/* Display the interest count */}
        <p>Total Interests Submitted: {countQuery.data}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {errors.form && <p className="error-msg">{errors.form}</p>}

          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Submitting...' : 'Submit'}
          </button>

          {mutation.isError && <p className="error-msg-global">Error submitting your interest</p>}
          {mutation.isSuccess && <p className="success-msg">Interest submitted successfully!</p>}
        </form>
      </div>
    </div>
  );
}

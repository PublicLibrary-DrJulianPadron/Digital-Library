// src/features/books/api/loansApiSlice.ts
import { apiSlice } from '@/common/api/apiSlice';
import type { components } from '@/common/types/generated-api-types';

export type Loan = components['schemas']['Loan'];
export type LoanRequest = components['schemas']['LoanRequest'];
export type PatchedLoanRequest = components['schemas']['PatchedLoanRequest'];
export type LoansList = Loan[];

export const loansApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookLoanHistory: builder.query<LoansList, string>({
      query: (id) => `/library/books/${id}/loan-history/`,
    }),
    getAllLoanHistory: builder.query<LoansList, { book?: string; ordering?: string; status?: 'Active' | 'Overdue' | 'Returned'; user?: number } | void>({
      query: (arg) => {
        const params = new URLSearchParams();
        if (arg) {
          Object.entries(arg).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: `/library/books/loan-history/`,
          params,
        };
      },
    }),
    getLoans: builder.query<LoansList, void>({
      query: () => `/library/loans/`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Loans' as const, id })), { type: 'Loans', id: 'LIST' }]
          : [{ type: 'Loans', id: 'LIST' }],
    }),
    createLoan: builder.mutation<Loan, LoanRequest>({
      query: (newLoan) => ({
        url: `/library/loans/`,
        method: 'POST',
        body: newLoan,
      }),
      invalidatesTags: [{ type: 'Loans', id: 'LIST' }],
    }),
    getLoanById: builder.query<Loan, string>({
      query: (id) => `/library/loans/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Loans', id }],
    }),
    updateLoan: builder.mutation<Loan, { id: string; body: LoanRequest }>({
      query: (loanData) => ({
        url: `/library/loans/${loanData.id}/`,
        method: 'PUT',
        body: loanData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Loans', id }],
    }),
    partialUpdateLoan: builder.mutation<Loan, { id: string; body: PatchedLoanRequest }>({
      query: (loanData) => ({
        url: `/library/loans/${loanData.id}/`,
        method: 'PATCH',
        body: loanData.body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Loans', id }],
    }),
    deleteLoan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/library/loans/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Loans', id }, { type: 'Loans', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBookLoanHistoryQuery,
  useGetAllLoanHistoryQuery,
  useGetLoansQuery,
  useCreateLoanMutation,
  useGetLoanByIdQuery,
  useUpdateLoanMutation,
  usePartialUpdateLoanMutation,
  useDeleteLoanMutation,
} = loansApiSlice;

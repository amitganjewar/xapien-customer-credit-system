// src/modules/credit-tracking/organisms/CustomerDetail.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomerDetail from './CustomerDetail';
import * as CustCtx from '../contexts/CustomerContext';
import * as Editor from '../hooks/useCustomerEditor';

jest.mock('../contexts/CustomerContext');
jest.mock('../hooks/useCustomerEditor');

const useCustomersMock = CustCtx.useCustomers as jest.Mock;
const useEditorMock    = Editor.useCustomerEditor as jest.Mock;

describe('CustomerDetail form interactions', () => {
  const customer = {
    id: '1',
    name: 'Acme Co',
    plan: 'Basic' as const,
    monthlyCredits: 100,
    perUserLimit: 10,
    usedCredits: 20,
    users: 3
  };
  let dispatchMock: jest.Mock;
  let saveMock:     jest.Mock;
  let showToastMock:jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    saveMock     = jest.fn().mockResolvedValue({ successes: [], failures: [] });
    showToastMock= jest.fn();

    // 1) Make the context return our single customer
    useCustomersMock.mockReturnValue({
      customers: [customer],
      loading: false,
      error: null,
      select:  jest.fn(),
      refresh: jest.fn(),
      selected: customer
    });

    // 2) Make the editor hook drive the draft form
    useEditorMock.mockReturnValue({
      state: {
        original: customer,
        draft:    { plan: 'Basic', perUserLimit: 10, topUp: 0 }
      },
      dispatch: dispatchMock,
      isDirty:  true,
      save:     saveMock
    });
  });

  it('renders the form fields and Save button', () => {
    render(<CustomerDetail showToast={showToastMock} />);
    expect(screen.getByTestId('plan-select')).toHaveValue('Basic');
    expect(screen.getByTestId('limit-input')).toHaveValue(10);
    expect(screen.getByTestId('topup-input')).toHaveValue(0);
    expect(screen.getByTestId('save-button')).toBeEnabled();
  });

  it('dispatches the right actions on input changes', () => {
    render(<CustomerDetail showToast={showToastMock} />);

    fireEvent.change(screen.getByTestId('plan-select'), { target: { value: 'Enterprise' } });
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'SET_PLAN', value: 'Enterprise' });

    fireEvent.change(screen.getByTestId('limit-input'), { target: { value: '25' } });
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'SET_LIMIT', value: 25 });

    fireEvent.change(screen.getByTestId('topup-input'), { target: { value: '15' } });
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'SET_TOPUP', value: 15 });
  });

  it('calls save() and showToast on Save click', async () => {
    render(<CustomerDetail showToast={showToastMock} />);
    fireEvent.click(screen.getByTestId('save-button'));

    await waitFor(() => expect(saveMock).toHaveBeenCalled());
    expect(showToastMock).toHaveBeenCalledWith(expect.stringMatching(/Successfully updated/));
  });
});

import React from 'react';

type Props = {
  data: any;
};

const BankingDetails = (props: Props) => {
  return (
    <div className="flex flex-col gap-2 mb-5">
      <p className="text-lg font-medium">Bank Name: {props.data.name}</p>
      <p className="text-lg font-medium">Account No: {props.data.accountNo}</p>
      <p className="text-lg font-medium">
        Account Type: {props.data.accountType}
      </p>
      <p className="text-lg font-medium">
        Branch Code: {props.data.branchCode}
      </p>
    </div>
  );
};

export default BankingDetails;

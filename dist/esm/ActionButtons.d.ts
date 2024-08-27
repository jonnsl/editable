import React, { MouseEvent } from 'react';
export type ActionButtonsProps = {
    locked?: boolean | undefined;
    colSpan?: number | undefined;
    onConfirm: (e: MouseEvent<HTMLButtonElement>) => void;
    onCancel: (e: MouseEvent<HTMLButtonElement>) => void;
    onDelete: (e: MouseEvent<HTMLButtonElement>) => void;
};
export default function ActionButtons(props: ActionButtonsProps): React.JSX.Element;

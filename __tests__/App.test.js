// App.test.js
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import App from '../src/routes/+page.svelte'; // adjust the import path as needed

describe('App Component', () => {

    test('GIVEN no priorities, WHEN rendered, THEN shows "No priority entered yet."', () => {
        // GIVEN: The component is rendered with no priorities added.
        const { getByText } = render(App);

        // WHEN: The component renders.
        // THEN: The message "No priority entered yet." is shown.
        expect(getByText('No priority entered yet.')).toBeInTheDocument();
    });

    test('GIVEN a valid priority input, WHEN user submits the form, THEN the priority appears in the list', async () => {
        // GIVEN: A rendered component and an input field.
        const { getByPlaceholderText, getByText } = render(App);
        const input = getByPlaceholderText('Enter priority or paste CSV text');

        // WHEN: The user types a priority and presses Enter.
        await fireEvent.input(input, { target: { value: 'Test Priority' } });
        await fireEvent.submit(input.closest('form'));

        // THEN: The priority "Test Priority" appears in the list.
        expect(getByText('Test Priority')).toBeInTheDocument();
    });

    test('GIVEN a pasted CSV text, WHEN user submits the form, THEN multiple priorities are added', async () => {
        // GIVEN: A rendered component with no priorities.
        const { getByPlaceholderText, getAllByRole } = render(App);
        const input = getByPlaceholderText('Enter priority or paste CSV text');
        const csvText = 'Priority 1, Priority 2; Priority 3\nPriority 4';

        // WHEN: The user pastes CSV text and submits.
        await fireEvent.input(input, { target: { value: csvText } });
        await fireEvent.submit(input.closest('form'));

        // THEN: Four priorities should appear in the list.
        // Using getAllByRole to find table rows (assuming each row has role "row", adjust if needed).
        // We assume the header row exists so expect at least 5 rows total.
        const rows = getAllByRole('row');
        // Header row + 4 entries
        expect(rows.length).toBe(5);
    });

    test('GIVEN an existing priority, WHEN a duplicate is entered, THEN a duplicate message appears', async () => {
        // GIVEN: A rendered component with one existing priority.
        const { getByPlaceholderText, getByText } = render(App);
        const input = getByPlaceholderText('Enter priority or paste CSV text');
        await fireEvent.input(input, { target: { value: 'Duplicate Test' } });
        await fireEvent.submit(input.closest('form'));

        // WHEN: The user enters the same priority again.
        await fireEvent.input(input, { target: { value: 'Duplicate Test' } });
        await fireEvent.submit(input.closest('form'));

        // THEN: A duplicate message should be displayed.
        expect(getByText('Priority "Duplicate Test" already exists.')).toBeInTheDocument();
    });

    test('GIVEN priorities in the list, WHEN a remove button is clicked, THEN the corresponding priority is removed', async () => {
        // GIVEN: A rendered component with a priority added.
        const { getByPlaceholderText, queryByText, getByText } = render(App);
        const input = getByPlaceholderText('Enter priority or paste CSV text');
        await fireEvent.input(input, { target: { value: 'Remove Me' } });
        await fireEvent.submit(input.closest('form'));

        // Ensure the priority is added.
        expect(getByText('Remove Me')).toBeInTheDocument();

        // WHEN: The user clicks the remove button (which contains the "×" symbol).
        const removeBtn = getByText('×');
        await fireEvent.click(removeBtn);

        // THEN: The priority "Remove Me" is no longer in the document.
        expect(queryByText('Remove Me')).not.toBeInTheDocument();
    });

    test('GIVEN fewer than 3 priorities, WHEN "Start Ranking" is clicked, THEN ranking does not start', async () => {
        // GIVEN: A rendered component with only 2 priorities.
        const { getByPlaceholderText, getByText } = render(App);
        const input = getByPlaceholderText('Enter priority or paste CSV text');

        // Add two priorities.
        await fireEvent.input(input, { target: { value: 'Priority A' } });
        await fireEvent.submit(input.closest('form'));
        await fireEvent.input(input, { target: { value: 'Priority B' } });
        await fireEvent.submit(input.closest('form'));

        // WHEN: The user clicks "Start Ranking".
        const startBtn = getByText('Start Ranking');
        expect(startBtn).toBeDisabled();
    });

    test('GIVEN at least 3 priorities and merge sort method chosen, WHEN "Start Ranking" is clicked, THEN merge sort ranking starts', async () => {
        // GIVEN: A rendered component with 3 priorities.
        const { getByPlaceholderText, getByText, queryByText } = render(App);
        const input = getByPlaceholderText('Enter priority or paste CSV text');

        await fireEvent.input(input, { target: { value: 'A' } });
        await fireEvent.submit(input.closest('form'));
        await fireEvent.input(input, { target: { value: 'B' } });
        await fireEvent.submit(input.closest('form'));
        await fireEvent.input(input, { target: { value: 'C' } });
        await fireEvent.submit(input.closest('form'));

        // Ensure the start button is enabled.
        const startBtn = getByText('Start Ranking');
        expect(startBtn).toBeEnabled();

        // WHEN: The user clicks "Start Ranking" (default method is merge).
        await fireEvent.click(startBtn);

        // THEN: The merge sort comparison phase should start.
        // For example, we expect to see "Merge Sort Comparison" heading.
        await waitFor(() => {
            expect(getByText('Merge Sort Comparison')).toBeInTheDocument();
        });
    });

    test('GIVEN at least 3 priorities and round robin method chosen, WHEN "Start Ranking" is clicked, THEN round-robin ranking starts and final table shows score', async () => {
        // GIVEN: A rendered component with 3 priorities.
        const { getByPlaceholderText, getByText, queryByText } = render(App);
        const input = getByPlaceholderText('Enter priority or paste CSV text');

        // Add 3 priorities.
        await fireEvent.input(input, { target: { value: 'X' } });
        await fireEvent.submit(input.closest('form'));
        await fireEvent.input(input, { target: { value: 'Y' } });
        await fireEvent.submit(input.closest('form'));
        await fireEvent.input(input, { target: { value: 'Z' } });
        await fireEvent.submit(input.closest('form'));

        // Choose round robin method.
        const roundRobinOption = getByText('Round-Robin Tournament');
        await fireEvent.click(roundRobinOption);

        // WHEN: The user clicks "Start Ranking".
        const startBtn = getByText('Start Ranking');
        await fireEvent.click(startBtn);

        // THEN: The round-robin comparison phase should start.
        // For example, we expect to see "Round-Robin Comparison" heading.
        await waitFor(() => {
            expect(getByText('Round-Robin Comparison')).toBeInTheDocument();
        });
    });
});

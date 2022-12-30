import { App, SuggestModal, MarkdownRenderChild, Component } from 'obsidian';
import { TaskGroup } from 'Query/TaskGroup';
import { Task, scheduledDateSymbol } from 'Task';
import { replaceTaskWithTasks } from 'File';
import { addDatesSuggestions } from './Suggestor/Suggestor';
import type { DateSuggestInfo } from './Suggestor/Suggestor';
import { getSettings } from 'Config/Settings';

export class SnoozeModal extends SuggestModal<DateSuggestInfo> {
    private taskOrGroup: Task | TaskGroup;

    constructor(app: App, taskOrGroup: Task | TaskGroup) {
        super(app);

        this.taskOrGroup = taskOrGroup;
    }

    open(): void {
        super.open();

        const el = document.createElement('div');
        el.addClass('snooze-modal-label');

        if (this.taskOrGroup instanceof Task) {
            el.textContent = `Snoozing "${this.taskOrGroup.description}"`;
        } else if (this.taskOrGroup instanceof TaskGroup) {
            el.textContent = `Snoozing ${this.taskOrGroup.tasks.length} tasks from group "${
                this.taskOrGroup.groupHeadings[this.taskOrGroup.groupHeadings.length - 1].name
            }"`;
        } else {
            el.textContent = 'Error identifying task to be snoozed...';
        }

        this.modalEl.prepend(el);
    }

    getSuggestions(query: string): DateSuggestInfo[] | Promise<DateSuggestInfo[]> {
        // need to add a space here at the front because a match at index zero
        // breaks a conditional within this function
        const suggestions = addDatesSuggestions(` ${scheduledDateSymbol}${query}`, 1, getSettings());
        return suggestions;
    }
    renderSuggestion(value: DateSuggestInfo, el: HTMLElement) {
        el.createEl('div', { text: value.displayText });
    }
    onChooseSuggestion(item: DateSuggestInfo, evt: MouseEvent | KeyboardEvent) {
        if (this.taskOrGroup instanceof Task) {
            if (item.date == undefined) {
                throw new Error('Unable to identify date to snooze task to.');
            }

            replaceTaskWithTasks({
                originalTask: this.taskOrGroup,
                newTasks: [new Task({ ...this.taskOrGroup, scheduledDate: item.date })],
            });
        } else if (this.taskOrGroup instanceof TaskGroup) {
            if (item.date == undefined) {
                throw new Error('Unable to identify date to snooze tasks to.');
            }

            let tasksToUpdate: Array<{ originalTask: Task; newTasks: Task[] }> = [];
            for (const task of this.taskOrGroup.tasks) {
                if (task.scheduledDate && task.scheduledDate > item.date) continue;
                else
                    tasksToUpdate.push({
                        originalTask: task,
                        newTasks: [new Task({ ...task, scheduledDate: item.date })],
                    });
            }

            let processTaskUpdate = async (i: number) => {
                await replaceTaskWithTasks(tasksToUpdate[i]);
                if (i < tasksToUpdate.length - 1) await processTaskUpdate(i + 1);
            };

            processTaskUpdate(0);
        } else {
            throw new Error('Failed identifying task or group of tasks to snooze.');
        }
    }
}

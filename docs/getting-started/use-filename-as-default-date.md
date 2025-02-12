---
layout: default
title: Use Filename as Default Date
nav_order: 5
parent: Getting Started
has_toc: false
---

# Use Filename as Default Date

{: .no_toc }

<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
1. TOC
{:toc}
</details>

---

## Automatic scheduled date

> Introduced in Tasks 1.18.0.

You can automatically set a scheduled date for tasks based on the name of their files. This feature can be enabled in the
settings, via the option `Use filename as Scheduled date for undated tasks`. Changing this requires a restart of Obsidian.

This allows you, for instance, to make all the tasks in your daily notes be considered as scheduled. You can then
query them using the `scheduled` and `happens` [filters]({{ site.baseurl }}{% link queries/filters.md %}).

Example query :

````text
```tasks
scheduled before today
group by scheduled
not done
```
````

<div class="code-example" markdown="1">
Info
{: .label .label-blue }
The task is not visually modified in any Obsidian views: the scheduled date is only implied, and not displayed.

It will however appear in the
[edit dialog]({{ site.baseurl }}{% link getting-started/create-or-edit-task.md %}).
It can also be examined by using the `group by scheduled` instruction in a tasks block.
</div>

## Rules

For the scheduled date to be automatically set from the file name, the following rules apply :

- the setting 'Use filename as Scheduled date for undated tasks' must be enabled, and Obsidian restarted,
- the task must have no existing scheduled date, due date or start date,
- the file name must contain a date in the format `YYYY-MM-DD` or `YYYYMMDD`,
- the file must be in one of the configured folders or its sub-folders if that setting is enabled.

Examples of file names :

```text
daily/2022-10-12 Wednesday.md
meetings/rd. 2022-09-07.md
20220612 - random thoughts.md
```

## Settings

The following image shows the two settings relating to this feature:

![Use filename as Scheduled date for undated tasks settings](../images/settings-use-filename-for-date.png)

### Folders setting

If the `Folders with default Scheduled dates` field is left empty in the settings dialog, default dates are applied to un-dated tasks all the
files in the vault.

A comma-separated list of folders can be entered to limit the scope. Default dates will then only be applied to undated tasks in all files in the specified folders and their subfolders.

Examples:

| Folders setting   | Matching files                                                                          | Not matching                               |
| ----------------- | --------------------------------------------------------------------------------------- | ------------------------------------------ |
| (empty)           | `20221022.md`<br/>`daily/20221012.md`                                                   |                                            |
| `daily`           | `daily/2022-10-12.md`<br/>`daily/notes/2022-10-12.md`                                   | `20221022.md`<br/>`meetings/2022-10-12.md` |
| `daily,prj/daily` | `daily/2022-10-12.md`<br/>`prj/daily/2022-10-12.md`<br/>`prj/daily/notes/2022-06-12.md` | `20221022.md`<br/>`meetings/2022-10-12.md` |

<div class="code-example" markdown="1">
Warning
{: .label .label-yellow }
Folders with a comma (`,`) in their name are not supported.
</div>

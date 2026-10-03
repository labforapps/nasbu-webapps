import { of } from 'rxjs';
import { HeaderComponent } from '../components/layout/header/header.component';
import { ExpedientInfoComponent } from './expedient/expedient-info/expedient-info.component';
import { TaskpageComponent } from './taskpage/taskpage.component';

describe('Notification call to action', () => {
  const route = (query: { [key: string]: string }) => ({
    snapshot: { paramMap: { get: () => 'case-1' }, queryParamMap: { get: (key: string) => query[key] ?? null } },
    queryParamMap: of({ get: (key: string) => query[key] ?? null })
  });

  it('opens app links with the router and external links with a full navigation', () => {
    const router = jasmine.createSpyObj('router', ['navigateByUrl', 'navigate']);
    const header = new HeaderComponent({} as any, {} as any, {} as any, {} as any, {} as any, router, {} as any);
    header.openNotificationLink(`${window.location.origin}/#/task?task=t1&ssid=s1`);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/task?task=t1&ssid=s1');
    header.openNotificationLink('');
    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
  });

  it('opens the linked task detail', () => {
    const dialog = jasmine.createSpyObj('dialog', ['open']);
    const page = new TaskpageComponent(dialog, {} as any, {} as any, {} as any, route({ task: 't2' }) as any);
    page.allTasks = [{ uuid: 't1' }, { uuid: 't2', customer: { uuid: 'c1' } }] as any;
    page.openLinkedTask();
    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialog.open.calls.mostRecent().args[1].data.task.uuid).toBe('t2');
  });

  it('ignores a task link that is not in the list', () => {
    const dialog = jasmine.createSpyObj('dialog', ['open']);
    const page = new TaskpageComponent(dialog, {} as any, {} as any, {} as any, route({ task: 'missing' }) as any);
    page.allTasks = [{ uuid: 't1' }] as any;
    page.openLinkedTask();
    expect(dialog.open).not.toHaveBeenCalled();
  });

  it('selects expedient tabs by name or by index', () => {
    for (const [tab, index] of [['wallet', 4], ['documents', 0], ['1', 1], ['bogus', 0]] as [string, number][]) {
      const page = new ExpedientInfoComponent({} as any, {} as any, route({ tab }) as any, {} as any, {} as any);
      page.getQueryParamByUrl();
      expect(page.selectedTabIndex).toBe(index);
    }
  });
});

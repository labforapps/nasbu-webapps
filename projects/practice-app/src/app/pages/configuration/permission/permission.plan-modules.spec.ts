import { ModulesAccess } from 'core-models';
import { PermissionComponent } from './permission.component';

describe('PermissionComponent – solo módulos del plan (NAS-092)', () => {
  const access = (module: string): ModulesAccess => ({ module, type: 'A', active: true } as ModulesAccess);

  it('quita del envío los módulos que el plan no incluye', () => {
    const result = PermissionComponent.onlyPlanModules(
      [access('all'), access('customers'), access('documents')], ['all', 'customers', 'tasks']);

    expect(result.map(a => a.module)).toEqual(['all', 'customers']);
  });

  it('tolera un grupo sin módulos', () => {
    expect(PermissionComponent.onlyPlanModules(undefined as any, ['customers'])).toEqual([]);
  });
});

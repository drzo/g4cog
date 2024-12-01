import { produce } from 'immer';
import type { AtomSpaceService } from '../atomspace/AtomSpaceService';
import type { TransformerService } from '../transformer/TransformerService';
import type { ValidationService } from '../validation/ValidationService';
import type { StateSnapshot } from './StateSnapshot';
import { SnapshotManager } from './StateSnapshot';

export class StateManager {
  private atomSpace: AtomSpaceService;
  private transformer: TransformerService;
  private validator: ValidationService;
  private history: StateSnapshot[] = [];
  private maxHistory: number = 10;

  constructor(
    atomSpace: AtomSpaceService,
    transformer: TransformerService,
    validator: ValidationService
  ) {
    this.atomSpace = atomSpace;
    this.transformer = transformer;
    this.validator = validator;
    this.saveState();
  }

  saveState(modifiedTraits: string[] = []): void {
    const validationErrors = this.validator.validateStateConsistency();
    const snapshot = SnapshotManager.createSnapshot(
      this.atomSpace.getState(),
      this.transformer.getState(),
      modifiedTraits,
      validationErrors
    );

    this.history.push(snapshot);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  rollback(): boolean {
    if (this.history.length < 2) return false;

    // Remove current state
    this.history.pop();
    // Get previous state
    const previousState = this.history[this.history.length - 1];

    // Restore state
    this.atomSpace.setState(previousState.atomSpace);
    this.transformer.setState(previousState.transformer);

    return true;
  }

  updateAtomSpace(updater: (atoms: Record<string, Atom>) => void): void {
    const newState = produce(this.atomSpace.getState(), updater);
    this.atomSpace.setState(newState);
    this.saveState();
  }

  updateTransformer(updater: (state: TransformerState) => void): void {
    const newState = produce(this.transformer.getState(), updater);
    this.transformer.setState(newState);
    this.saveState();
  }

  getSnapshot(): StateSnapshot {
    return this.history[this.history.length - 1];
  }

  getStateChanges(fromIndex: number = -2): {
    atomChanges: string[];
    weightChanges: string[];
  } | null {
    if (this.history.length < 2) return null;

    const beforeState = this.history.at(fromIndex);
    const afterState = this.history[this.history.length - 1];

    if (!beforeState) return null;

    return SnapshotManager.compareSnapshots(beforeState, afterState);
  }

  validateCurrentState(): string[] {
    return this.validator.validateStateConsistency();
  }
}
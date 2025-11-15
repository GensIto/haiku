export interface IKigoDetectionService {
  detectKigo(text: string): Promise<boolean>;
}

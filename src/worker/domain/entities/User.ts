/**
 * User Domain Entity
 * ドメイン層のUserエンティティ
 * 外部ライブラリやインフラ層の詳細に依存しない純粋なドメインモデル
 */
export class User {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * ファクトリーメソッド: Userエンティティを生成
   */
  static create(props: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      props.id,
      props.name,
      props.email,
      props.createdAt,
      props.updatedAt
    );
  }

  /**
   * エンティティを平坦なオブジェクトに変換（表示用など）
   */
  toObject(): {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

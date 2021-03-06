/** @experimental */
export declare function bootstrap<C>(appComponentType: ConcreteType<C>, customProviders?: Array<any>): Promise<ComponentRef<C>>;

/** @experimental */
export declare function bootstrapWorkerApp(appComponentType: Type, customProviders?: Array<any>): Promise<ComponentRef<any>>;

/** @experimental */
export declare function bootstrapWorkerUi(workerScriptUri: string, customProviders?: Array<any>): Promise<ApplicationRef>;

/** @experimental */
export declare const BROWSER_APP_COMPILER_PROVIDERS: Array<any>;

/** @experimental */
export declare const BROWSER_DYNAMIC_COMPILER_FACTORY: CompilerFactory;

/** @experimental */
export declare const BROWSER_DYNAMIC_PLATFORM_PROVIDERS: Array<any>;

/** @experimental */
export declare const browserDynamicPlatform: () => PlatformRef;

/** @experimental */
export declare const CACHED_TEMPLATE_PROVIDER: Array<any>;

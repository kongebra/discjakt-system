import { Injectable } from '@nestjs/common';
import { Context, Span, SpanOptions, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('scraper_app');

@Injectable()
export class TracerService {
  public startActiveSpan<F extends (span: Span) => unknown>(
    name: string,
    fn: F,
  ): ReturnType<F> {
    return tracer.startActiveSpan(name, fn);
  }

  public startSpan(
    name: string,
    options?: SpanOptions,
    context?: Context,
  ): Span {
    return tracer.startSpan(name, options, context);
  }
}

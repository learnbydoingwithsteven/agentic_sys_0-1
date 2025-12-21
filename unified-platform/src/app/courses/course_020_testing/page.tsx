import React from 'react';
import { TestingLab } from '@/components/demos/course_020_testing/TestingLab';
import { TestTube, Target, CheckCircle, TrendingUp } from 'lucide-react';

export default function CoursePage() {
  return (
    <div className="flex bg-white dark:bg-zinc-950 min-h-screen font-sans text-zinc-900 dark:text-zinc-100">

      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 max-w-4xl mx-auto p-6 lg:p-12 xl:p-16 w-full">
          <header className="mb-12">
            <div className="text-sm font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-3">Module 2.10</div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Basic Agent Testing
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
              Build reliable agents through systematic testing. Learn to write unit tests, integration tests, and validation checks that ensure your agents behave correctly.
            </p>
          </header>

          <section id="why-test" className="mb-16 scroll-mt-20">
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> Why Test Agents?
              </h4>
              <p className="text-indigo-800 dark:text-indigo-200/80 mb-4 leading-relaxed">
                LLMs are non-deterministic by nature. The same prompt can produce different outputs. Testing helps you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-indigo-800 dark:text-indigo-200/80 ml-2">
                <li><strong>Catch regressions</strong>: Ensure updates don't break existing functionality</li>
                <li><strong>Validate constraints</strong>: Check output length, format, and content requirements</li>
                <li><strong>Measure reliability</strong>: Track pass rates and identify failure patterns</li>
                <li><strong>Build confidence</strong>: Deploy agents knowing they meet quality standards</li>
              </ul>
            </div>
          </section>

          <section id="test-types" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">01</span>
              Types of Agent Tests
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-blue-600 text-xs">U</span>
                  </div>
                  Unit Tests
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Test individual agent responses to specific inputs. Verify factual accuracy and basic functionality.
                </p>
                <div className="text-xs font-mono bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700">
                  Input: "What is 2+2?"<br />
                  Expected: /4|four/i
                </div>
              </div>

              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-emerald-600 text-xs">I</span>
                  </div>
                  Integration Tests
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Test multi-step reasoning and complex interactions. Verify the agent can handle compound queries.
                </p>
                <div className="text-xs font-mono bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700">
                  Input: "If X then Y?"<br />
                  Expected: Logical reasoning
                </div>
              </div>

              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-purple-600 text-xs">V</span>
                  </div>
                  Validation Tests
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Test output constraints like length, format, and structure. Ensure responses meet requirements.
                </p>
                <div className="text-xs font-mono bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700">
                  Length: 10-200 chars<br />
                  Format: Plain text
                </div>
              </div>

              <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <span className="text-orange-600 text-xs">R</span>
                  </div>
                  Regression Tests
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Test consistency over time. Ensure agent behavior remains stable across updates.
                </p>
                <div className="text-xs font-mono bg-white dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700">
                  Run: Same test repeatedly<br />
                  Expected: Consistent results
                </div>
              </div>
            </div>
          </section>

          <section id="best-practices" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">02</span>
              Testing Best Practices
            </h2>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
              <ul className="space-y-3 text-sm text-amber-800 dark:text-amber-200">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Use pattern matching</strong>: Test for concepts, not exact strings (e.g., /paris/i instead of "Paris")
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Set timeouts</strong>: Prevent tests from hanging indefinitely on slow responses
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Test edge cases</strong>: Include empty inputs, very long inputs, and unusual queries
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Track metrics</strong>: Monitor pass rates, execution times, and failure patterns
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Automate testing</strong>: Run test suites automatically on every deployment
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section id="workflow" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm">03</span>
              Test-Driven Development
            </h2>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 font-bold text-indigo-600">1</div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Write Tests First</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Define expected behavior before implementing the agent. This clarifies requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 font-bold text-indigo-600">2</div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Run Tests (They Fail)</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Initial test run should fail since the agent isn't implemented yet.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 font-bold text-indigo-600">3</div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Implement Agent</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Build the agent to pass the tests. Focus on meeting the defined requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 font-bold text-indigo-600">4</div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Run Tests (They Pass)</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Verify all tests pass. If not, iterate until they do.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 font-bold text-indigo-600">5</div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Refactor & Repeat</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Improve code quality while keeping tests passing. Add new tests for new features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>

        <aside className="lg:w-96 xl:w-[30rem] px-6 lg:px-8 py-12 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20">
          <div className="sticky top-6">
            <TestingLab />
          </div>
        </aside>
      </div>
    </div>
  );
}

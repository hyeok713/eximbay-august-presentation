(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const currentEl = document.getElementById('current');
  const progressEl = document.getElementById('progress');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const modal = document.getElementById('roleModal');
  const closeBtn = modal.querySelector('.modal-close');
  const rolePrevBtn = modal.querySelector('.role-prev-step');
  const rolePlayBtn = modal.querySelector('.role-play');
  const roleNextBtn = modal.querySelector('.role-next-step');
  const processSlide = document.querySelector('.process-slide');
  const processStepTabs = [...document.querySelectorAll('[data-process-step-target]')];
  const processNextBtn = document.querySelector('.process-next-step');
  const processStateTitle = document.getElementById('processStateTitle');
  const processStateCaption = document.getElementById('processStateCaption');
  const processThesis = document.getElementById('processThesis');
  const bottleneckStage = document.querySelector('.bottleneck-stage');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let touchStartX = 0;
  let activeRoleKey = null;
  let roleStep = 0;
  let rolePlaying = false;
  let roleTimer = null;
  let activityTimer = null;
  let activityLandingTimer = null;
  let activityTransfer = null;

  const roles = {
    leader: {
      index: '01', title: 'Project Leader',
      avatar: 'assets/profile/agent-project-leader.svg',
      mission: '요청 → Spec 작성 → Jira 생성·연결',
      steps: [
        {
          nav: '요청', source: 'WORKER', sourceClass: 'worker',
          input: '전자영수증 로고 이슈가 있어.\n수정 작업으로 준비해줘.',
          phase: '요청 수신',
          process: [
            '요구사항명세서 · 기획문서 조회',
            '범위 · 기술 제약 · 우선순위 확인',
            '모호한 요구는 질문으로 구체화'
          ],
          reply: '알겠어요. 요청 내용을 작업 가능한 형태로 정리할게요.',
          artifacts: [{ label: 'REQUEST', value: 'RECEIVED', tone: 'pass' }],
          caption: '작업자 요청이 Project Leader 자동 공정의 시작점'
        },
        {
          nav: 'Spec', source: 'AGENT AUTO', sourceClass: 'agent',
          input: '요청 내용 확인 완료\nSpec 작성 자동 진행',
          phase: 'Spec 작성',
          process: [
            '프로젝트 구조 · 기존 코드 패턴 탐색',
            '작업 분해 — 파일 1~5개 · 체크리스트 3~10개',
            'Spec 간 의존 관계 · 병렬 가능 여부 정의',
            '영향 분석 · 수락 기준 작성',
            '사용자 승인 후 확정'
          ],
          reply: '수정 범위와 완료 조건을 Spec으로 만들었어요.',
          artifacts: [{ label: 'SPEC', value: 'TODO · SPEC-…', tone: 'pass' }],
          caption: '요청 내용을 실행 가능한 Spec으로 자동 변환'
        },
        {
          nav: 'Jira', source: 'AGENT AUTO', sourceClass: 'agent',
          input: 'Spec 작성 완료\nJira 발행 자동 진행',
          phase: 'Jira 생성 · 연결',
          process: [
            'project.md에서 프로젝트 키 · 작업자 · 라벨 · 분류 확보',
            '티켓 생성 — 제목에 spec_id 기입',
            '생성 후 제목 · 담당자 재조회 검증',
            'Spec에 이슈 키 기록 — 양방향 연결'
          ],
          reply: 'Spec과 Jira 티켓을 만들고 연결했어요. 이제 작업을 시작할 수 있어요.',
          artifacts: [
            { label: 'SPEC', value: 'TODO · SPEC-…', tone: 'pass' },
            { label: 'JIRA', value: 'TO DO · SBD-…', tone: 'pass' },
            { label: 'LINK', value: 'SPEC ↔ JIRA', tone: 'pass' }
          ],
          caption: 'Spec 생성 · Jira 발행 · 양방향 연결까지 자동 완료'
        }
      ]
    },
    builder: {
      index: '02', title: 'Builder',
      avatar: 'assets/profile/agent-builder.svg',
      mission: '작업 할당 → Spec/Jira 갱신·구현 → 품질 Agent 호출',
      steps: [
        {
          nav: '할당', source: 'WORKER', sourceClass: 'worker',
          input: 'SBD-XXXX 작업 시작해줘.',
          phase: 'Spec 확인',
          process: [
            'Jira 티켓에서 spec_id 식별',
            'workspace ↔ 프로젝트 키 일치 검증',
            '로컬 Spec 확인 — status · 검수 이력'
          ],
          reply: '연결된 Spec을 확인했어요. 작업 범위대로 시작할게요.',
          artifacts: [{ label: 'SPEC', value: 'READY', tone: 'pass' }],
          caption: '작업 할당과 동시에 Jira에서 연결된 Spec 자동 확인'
        },
        {
          nav: '작업', source: 'AGENT AUTO', sourceClass: 'agent',
          input: 'Spec 확인 완료\n구현 자동 진행',
          phase: '상태 갱신 · 구현',
          process: [
            'Jira 개발중 전환 + 시작일 기록',
            '기존 코드 패턴 · 컨벤션 파악',
            'Spec 파일 범위 안에서만 구현',
            '체크리스트 체크 · 작업 일지 기록',
            '수락 기준 자체 점검'
          ],
          reply: 'Jira와 Spec을 진행 중으로 바꾸고 작업을 시작했어요.',
          artifacts: [
            { label: 'SPEC', value: 'IN_PROGRESS', tone: 'pass' },
            { label: 'JIRA', value: '개발중', tone: 'pass' }
          ],
          caption: '착수 상태 반영 후 Spec 범위에 따라 구현 진행'
        },
        {
          nav: '검수 호출', source: 'AGENT AUTO', sourceClass: 'agent',
          input: '구현 완료\n품질 검수 자동 호출',
          phase: 'Tester · Reviewer 호출',
          process: [
            'Reviewer 호출 — Spec 경로 · 변경 파일 · 구현 요약 전달',
            '판정에 따라 Tester 호출 또는 재작업',
            '최종 GO 시 git 컨벤션 확정 후 커밋'
          ],
          reply: '작업을 마쳤어요. 결과와 Spec을 Tester와 Reviewer에게 넘겼어요.',
          artifacts: [{ label: 'HANDOFF', value: 'TESTER · REVIEWER', tone: 'pass' }],
          caption: '구현 완료 시 Tester와 Reviewer 공정 자동 호출'
        }
      ]
    },
    tester: {
      index: '03', title: 'Tester',
      avatar: 'assets/profile/agent-tester.svg',
      mission: 'Spec 수신 → 테스트 자동 실행 → Reviewer 전달',
      steps: [
        {
          nav: '수신', source: 'BUILDER', sourceClass: 'agent', sourceRole: 'builder',
          input: '구현 완료\nSpec과 작업 결과 전달',
          phase: 'Spec 확인',
          process: [
            'Spec 수락 기준별 테스트 계획 수립',
            '기존 테스트 구조 · 프레임워크 파악',
            '변경 파일에서 테스트 대상 식별'
          ],
          reply: 'Spec을 확인했어요. 완료 조건 기준으로 테스트할게요.',
          artifacts: [{ label: 'SPEC', value: 'RECEIVED', tone: 'pass' }],
          caption: 'Builder 결과와 Spec을 함께 전달받아 테스트 기준 확보'
        },
        {
          nav: '테스트', source: 'AGENT AUTO', sourceClass: 'agent',
          input: 'Spec 확인 완료\n테스트 자동 진행',
          phase: '테스트 실행',
          process: [
            '수락 기준마다 최소 1개 테스트 작성',
            '대상 테스트 실행 → 전체 회귀 테스트',
            '실패 시 테스트 결함 / 프로덕션 결함 구분',
            '프로덕션 결함은 코드 수정 없이 Builder 반환'
          ],
          reply: '필요한 테스트를 모두 실행했고 결과도 정리했어요.',
          artifacts: [{ label: 'TEST', value: 'PASS', tone: 'pass' }],
          caption: '별도 지시 없이 Spec 기준 테스트와 결과 기록 자동 수행'
        },
        {
          nav: 'Reviewer', source: 'AGENT AUTO', sourceClass: 'agent',
          input: '테스트 완료\nReviewer 전달 자동 진행',
          phase: '검증 결과 전달',
          process: [
            'Spec frontmatter test_rounds 갱신',
            '실행 결과 · 실패 로그 근거 정리',
            'Reviewer에게 결과 인계'
          ],
          reply: '테스트 결과와 Spec을 Reviewer에게 넘겼어요.',
          artifacts: [{ label: 'HANDOFF', value: 'REVIEWER', tone: 'pass' }],
          caption: '테스트 완료 후 검증 결과와 Spec을 Reviewer에게 자동 인계'
        }
      ]
    },
    reviewer: {
      index: '04', title: 'Reviewer',
      avatar: 'assets/profile/agent-reviewer.svg',
      mission: 'Spec 확인 → 코드 교차검증 → DONE 처리 → Git Commit',
      steps: [
        {
          nav: '수신', source: 'TESTER / BUILDER', sourceClass: 'reviewer', sourceRole: 'tester',
          input: '작업과 테스트 완료\nSpec · 코드 · 결과 전달',
          phase: 'Spec 확인',
          process: [
            'Spec 수락 기준 · 영향 분석 파악',
            '변경 파일 목록으로 검수 범위 설정'
          ],
          reply: 'Spec과 작업 결과를 확인했어요. 실제 코드와 맞는지 검수할게요.',
          artifacts: [{ label: 'SPEC', value: 'IN_REVIEW', tone: 'pass' }],
          caption: 'Spec을 기준으로 검수할 작업 범위 자동 설정'
        },
        {
          nav: '검수', source: 'AGENT AUTO', sourceClass: 'reviewer',
          input: 'Spec 확인 완료\n코드 교차검증 자동 진행',
          phase: 'Spec ↔ 코드 검증',
          process: [
            'Spec 준수 — 요구사항 · 파일 범위 · 인터페이스 계약',
            '코드 품질 — 컨벤션 · 에러 처리',
            'Regression · Side-effect 확인',
            '수락 기준 하나씩 대조',
            '테스트 필요 여부 판정 · 검수 이력 기록'
          ],
          reply: 'Spec의 완료 조건과 실제 코드가 모두 맞아요.',
          artifacts: [{ label: 'REVIEW', value: 'GO', tone: 'pass' }],
          caption: '문서의 완료 조건과 실제 구현을 직접 교차검증'
        },
        {
          nav: 'DONE', source: 'AGENT AUTO', sourceClass: 'reviewer',
          input: '검수 GO\n완료 처리 자동 진행',
          phase: 'Spec · Jira 완료 처리',
          process: [
            '테스트 코드 품질 검수 — AAA · 독립성 · Mock 범위',
            'Jira 완료일 기록 + QA 상태 전환',
            'Spec status DONE · completed_at 기록',
            '재조회로 반영 값 검증'
          ],
          reply: '검수 끝났어요. Spec은 DONE, Jira는 QA 상태로 처리했어요.',
          artifacts: [
            { label: 'SPEC', value: 'DONE', tone: 'pass' },
            { label: 'JIRA', value: 'QA진행', tone: 'pass' },
            { label: 'STATUS', value: 'SYNCED', tone: 'pass' }
          ],
          caption: '최종 GO와 동시에 Spec · Jira 완료 상태 자동 정합화'
        },
        {
          nav: 'Commit', source: 'AGENT AUTO', sourceClass: 'reviewer',
          input: '완료 상태 동기화 완료\nGit Commit 자동 진행',
          phase: 'Git Commit',
          process: [
            'Builder 커밋 호출 — Reviewer는 git 미사용',
            'push · PR은 사람이 직접 수행'
          ],
          reply: '완료 처리까지 끝났어요. Builder 커밋을 자동 호출해 Git 기록도 남겼어요.',
          artifacts: [{ label: 'GIT', value: 'COMMIT CREATED', tone: 'pass' }],
          caption: 'Reviewer 최종 GO 후 Builder 커밋 자동 호출 · push 제외'
        }
      ]
    }
  };

  const humanProfile = {
    title: '사용자', avatar: 'assets/profile/human-profile.png'
  };

  const activityMeta = {
    leader: [
      { icon: 'spec', tool: 'REQUEST' },
      { icon: 'spec', tool: 'SPEC' },
      { icon: 'jira', tool: 'JIRA' }
    ],
    builder: [
      { icon: 'spec', tool: 'SPEC' },
      { icon: 'jira', tool: 'JIRA · SPEC' },
      { icon: 'handoff', tool: 'AGENT HANDOFF' }
    ],
    tester: [
      { icon: 'spec', tool: 'SPEC' },
      { icon: 'test', tool: 'TEST' },
      { icon: 'handoff', tool: 'AGENT HANDOFF' }
    ],
    reviewer: [
      { icon: 'spec', tool: 'SPEC' },
      { icon: 'review', tool: 'REVIEW' },
      { icon: 'jira', tool: 'JIRA · SPEC' },
      { icon: 'git', tool: 'GIT COMMIT' }
    ]
  };

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  function animateCount(element) {
    const target = Number(element.dataset.count || 0);
    const prefix = element.dataset.prefix || '';
    const duration = target > 500 ? 1100 : 850;
    const start = performance.now();
    const formatter = new Intl.NumberFormat('ko-KR');
    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${prefix}${formatter.format(Math.round(target * eased))}`;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const processStates = [
    {
      title: '모든 단계를 사람이 직접 수행',
      caption: '조사부터 기록까지, 실행과 판단이 한 사람에게 집중됩니다.',
      thesis: 'Human이 실행·기록까지 떠안아 병목이 발생',
      next: 'AGENT LAYER 열기'
    },
    {
      title: '실행 업무를 Agent에게 이관',
      caption: 'Human은 방향·승인·예외 판단에 집중하고 반복 실행은 Agent가 담당합니다.',
      thesis: 'Human의 역할이 전 과정 수행에서 핵심 판단으로 축소',
      next: 'SYSTEM RECORD 열기'
    },
    {
      title: '상태와 증적은 시스템이 자동 기록',
      caption: 'Jira·Spec·Git이 실행 결과와 함께 갱신되어 별도 기록 업무가 사라집니다.',
      thesis: 'Human은 의사결정, Agent는 실행, System은 추적성을 담당',
      next: '처음부터 보기'
    }
  ];

  function setProcessStep(step) {
    if (!processSlide) return;
    const nextStep = Math.max(0, Math.min(processStates.length - 1, Number(step) || 0));
    const state = processStates[nextStep];
    processSlide.dataset.processStep = String(nextStep);
    processStepTabs.forEach((tab, tabIndex) => {
      const active = tabIndex === nextStep;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    processStateTitle.textContent = state.title;
    processStateCaption.textContent = state.caption;
    processThesis.textContent = state.thesis;
    processNextBtn.innerHTML = `${state.next} <span aria-hidden="true">${nextStep === processStates.length - 1 ? '↻' : '→'}</span>`;
  }

  function advanceProcessStep() {
    const currentStep = Number(processSlide?.dataset.processStep || 0);
    setProcessStep(currentStep >= processStates.length - 1 ? 0 : currentStep + 1);
  }

  function getLayoutBox(element, ancestor) {
    let x = 0;
    let y = 0;
    let node = element;

    // 애니메이션 transform을 제외한 최종 레이아웃 좌표를 누적한다.
    while (node && node !== ancestor) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent;
    }

    if (node !== ancestor) return null;
    return { x, y, width: element.offsetWidth, height: element.offsetHeight };
  }

  function drawBottleneckLines() {
    if (!bottleneckStage) return;
    const svg = bottleneckStage.querySelector('.bottleneck-lines');
    if (!svg) return;

    const width = bottleneckStage.clientWidth;
    const height = bottleneckStage.clientHeight;
    if (width === 0 || height === 0) return;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const sources = [...bottleneckStage.querySelectorAll('.context-sources > article')];
    const queues = [...bottleneckStage.querySelectorAll('.decision-queue > article')];
    const gate = bottleneckStage.querySelector('.human-gate');
    if (!gate || sources.length === 0 || sources.length !== queues.length) return;

    const edgePoint = (element, edge) => {
      const box = getLayoutBox(element, bottleneckStage);
      if (!box) return null;
      const x = edge === 'right' ? box.x + box.width : box.x;
      return { x, y: box.y + box.height / 2 };
    };

    const points = {
      'gate-left': edgePoint(gate, 'left'),
      'gate-right': edgePoint(gate, 'right')
    };
    sources.forEach((source, sourceIndex) => {
      points[`source-${sourceIndex}`] = edgePoint(source, 'right');
    });
    queues.forEach((queue, queueIndex) => {
      points[`queue-${queueIndex}`] = edgePoint(queue, 'left');
    });

    svg.querySelectorAll('path[data-from]').forEach(path => {
      const from = points[path.dataset.from];
      const to = points[path.dataset.to];
      if (!from || !to) return;
      const midX = (from.x + to.x) / 2;
      const d = `M${from.x.toFixed(1)} ${from.y.toFixed(1)} C${midX.toFixed(1)} ${from.y.toFixed(1)} ${midX.toFixed(1)} ${to.y.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
      path.setAttribute('d', d);
    });
  }

  let bottleneckRedrawScheduled = false;
  function scheduleBottleneckRedraw() {
    if (bottleneckRedrawScheduled) return;
    bottleneckRedrawScheduled = true;
    requestAnimationFrame(() => {
      bottleneckRedrawScheduled = false;
      drawBottleneckLines();
    });
  }

  window.addEventListener('resize', scheduleBottleneckRedraw);
  if (window.ResizeObserver && bottleneckStage) {
    const bottleneckResizeObserver = new ResizeObserver(scheduleBottleneckRedraw);
    bottleneckResizeObserver.observe(bottleneckStage);
    bottleneckStage.querySelectorAll('.context-sources, .decision-queue, .human-gate').forEach(element => {
      bottleneckResizeObserver.observe(element);
    });
  }
  if (document.fonts?.ready) document.fonts.ready.then(scheduleBottleneckRedraw);

  function activate(nextIndex, direction = 1) {
    nextIndex = Math.max(0, Math.min(slides.length - 1, nextIndex));
    if (nextIndex === index && slides[nextIndex].classList.contains('active')) return;
    const old = slides[index];
    old.classList.remove('active');
    old.classList.toggle('exit-left', direction > 0);
    index = nextIndex;
    const incoming = slides[index];
    incoming.classList.remove('exit-left');
    void incoming.offsetWidth;
    incoming.classList.add('active');
    currentEl.textContent = String(index + 1).padStart(2, '0');
    progressEl.style.width = `${((index + 1) / slides.length) * 100}%`;
    history.replaceState(null, '', `#${index + 1}`);
    incoming.querySelectorAll('[data-count]').forEach(element => {
      element.textContent = '0';
      animateCount(element);
    });
    if (incoming === processSlide) {
      const requestedProcessStep = new URLSearchParams(location.search).get('processStep');
      setProcessStep(requestedProcessStep === null ? 0 : requestedProcessStep);
    }
    if (bottleneckStage && incoming.contains(bottleneckStage)) {
      scheduleBottleneckRedraw();
      incoming.addEventListener('transitionend', scheduleBottleneckRedraw, { once: true });
    }
    document.title = `${String(index + 1).padStart(2, '0')} · ${incoming.dataset.title} — Software Manufacturing Process`;
  }

  function next() {
    if (!modal.classList.contains('open')) activate(index + 1, 1);
  }

  function prev() {
    if (!modal.classList.contains('open')) activate(index - 1, -1);
  }

  function clearRoleTimer() {
    if (roleTimer) window.clearTimeout(roleTimer);
    roleTimer = null;
  }

  function clearActivityTransfer() {
    if (activityTimer) window.clearTimeout(activityTimer);
    if (activityLandingTimer) window.clearTimeout(activityLandingTimer);
    activityTimer = null;
    activityLandingTimer = null;
    if (activityTransfer) activityTransfer.remove();
    activityTransfer = null;
  }

  function revealActivity(target, results) {
    if (!target) return;
    target.classList.remove('awaiting');
    target.classList.add('landed');
    const state = target.querySelector('.activity-state');
    if (state) state.textContent = 'DONE';
    results.classList.remove('awaiting');
    results.classList.add('landed');
  }

  function launchActivityTransfer() {
    clearActivityTransfer();
    const source = modal.querySelector('.chat-row.from-agent.current .chat-bubble');
    const target = modal.querySelector('.activity-item.active.awaiting');
    const results = modal.querySelector('.activity-results');
    if (!source || !target) return;
    if (reducedMotion) {
      revealActivity(target, results);
      return;
    }

    activityTimer = window.setTimeout(() => {
      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.querySelector('.activity-icon').getBoundingClientRect();
      const metaItem = activityMeta[activeRoleKey][roleStep];
      const startX = sourceRect.right - 28;
      const startY = sourceRect.top + sourceRect.height / 2 - 18;
      const endX = targetRect.left + targetRect.width / 2 - 18;
      const endY = targetRect.top + targetRect.height / 2 - 18;
      const chip = document.createElement('div');
      chip.className = 'activity-transfer';
      chip.innerHTML = `<img src="assets/icons/${escapeHTML(metaItem.icon)}.svg" alt=""><b>${escapeHTML(metaItem.tool)}</b>`;
      chip.style.left = `${startX}px`;
      chip.style.top = `${startY}px`;
      modal.appendChild(chip);
      activityTransfer = chip;

      chip.animate([
        { transform: 'translate(0,0) scale(.72)', opacity: 0 },
        { transform: 'translate(10px,-8px) scale(1.08)', opacity: 1, offset: .2 },
        { transform: `translate(${endX - startX}px,${endY - startY}px) scale(.76)`, opacity: 1 }
      ], { duration: 920, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });

      const finishTransfer = () => {
        if (!chip.isConnected) return;
        revealActivity(target, results);
        if (activityTransfer === chip) activityTransfer = null;
        chip.remove();
        activityLandingTimer = null;
      };
      activityLandingTimer = window.setTimeout(finishTransfer, 980);
    }, 720);
  }

  function renderRoleStep() {
    clearActivityTransfer();
    const role = roles[activeRoleKey];
    if (!role) return;
    const visibleSteps = role.steps.slice(0, roleStep + 1);
    const currentStep = role.steps[roleStep];
    const total = role.steps.length;
    const lastStep = total - 1;

    modal.querySelector('.chat-agent-name').textContent = role.title;
    const chatAvatar = modal.querySelector('.chat-avatar');
    chatAvatar.src = role.avatar;
    chatAvatar.alt = `${role.title} 프로필`;
    modal.querySelector('.chat-thread').innerHTML = visibleSteps.map((step, stepIndex) => {
      const isCurrent = stepIndex === roleStep ? 'current' : '';
      const isAuto = step.source.includes('AUTO');
      const incomingClass = step.sourceClass === 'worker' ? 'worker' : 'external';
      const incomingProfile = step.sourceClass === 'worker'
        ? humanProfile
        : (roles[step.sourceRole] || role);
      const incoming = isAuto ? '' : `
        <div class="chat-row ${incomingClass} ${isCurrent}">
          <div class="chat-bubble"><div class="chat-meta"><b>${escapeHTML(step.source)}</b></div><p>${escapeHTML(step.input)}</p></div>
          <img class="chat-mini-avatar" src="${escapeHTML(incomingProfile.avatar)}" alt="${escapeHTML(incomingProfile.title)} 프로필">
        </div>`;
      return `${incoming}
        <div class="chat-row from-agent ${isCurrent}">
          <img class="chat-mini-avatar" src="${escapeHTML(role.avatar)}" alt="${escapeHTML(role.title)} 프로필">
          <div class="chat-bubble"><div class="chat-meta"><b>${escapeHTML(role.title)}</b>${isAuto ? '<span>AUTO</span>' : ''}</div><p>${escapeHTML(step.reply)}</p></div>
        </div>`;
    }).join('');

    modal.querySelector('.activity-feed').innerHTML = visibleSteps.map((step, stepIndex) => {
      const metaItem = activityMeta[activeRoleKey][stepIndex];
      const isActive = stepIndex === roleStep;
      const state = isActive ? 'active awaiting' : 'done';
      // 진행 중 단계는 주요 작업 전체를 펼치고, 완료된 단계는 첫 줄만 요약한다
      const detail = isActive
        ? `<ul class="activity-steps">${step.process.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`
        : `<span>${escapeHTML(step.process[0])}</span>`;
      return `
        <div class="activity-item ${state}">
          <div class="activity-icon"><img src="assets/icons/${escapeHTML(metaItem.icon)}.svg" alt=""></div>
          <div class="activity-copy"><b>${escapeHTML(metaItem.tool)}</b>${detail}</div>
          <span class="activity-state">${isActive ? 'WAITING' : 'DONE'}</span>
        </div>`;
    }).join('');

    const results = modal.querySelector('.activity-results');
    results.className = 'activity-results awaiting';
    results.innerHTML = currentStep.artifacts.map(artifact => `
      <div class="activity-result"><small>${escapeHTML(artifact.label)}</small><b>${escapeHTML(artifact.value)}</b></div>`).join('');
    modal.querySelector('.chat-flow-note b').textContent = `STEP ${String(roleStep + 1).padStart(2, '0')}`;
    modal.querySelector('.chat-flow-note span').textContent = currentStep.caption;
    modal.querySelector('.role-step-count').textContent = `${String(roleStep + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    modal.querySelector('.role-step-progress i').style.width = `${((roleStep + 1) / total) * 100}%`;
    rolePrevBtn.disabled = roleStep === 0;
    roleNextBtn.textContent = roleStep === lastStep ? 'START OVER ↻' : 'NEXT STEP →';
    rolePlayBtn.textContent = rolePlaying ? 'PAUSE' : 'AUTO PLAY';
    rolePlayBtn.hidden = !rolePlaying && roleStep === lastStep;

    requestAnimationFrame(() => {
      const thread = modal.querySelector('.chat-thread');
      thread.scrollTop = thread.scrollHeight;
      launchActivityTransfer();
    });
  }

  function scheduleRolePlayback(delay = 3900) {
    clearRoleTimer();
    if (!rolePlaying || !activeRoleKey) return;
    const lastStep = roles[activeRoleKey].steps.length - 1;
    if (roleStep >= lastStep) {
      rolePlaying = false;
      rolePlayBtn.textContent = 'AUTO PLAY';
      rolePlayBtn.hidden = true;
      return;
    }
    roleTimer = window.setTimeout(() => {
      roleStep += 1;
      renderRoleStep();
      scheduleRolePlayback(delay);
    }, delay);
  }

  function startRolePlayback(restart = false, delay = 3900) {
    if (!activeRoleKey) return;
    const lastStep = roles[activeRoleKey].steps.length - 1;
    if (restart || roleStep >= lastStep) roleStep = 0;
    rolePlaying = true;
    renderRoleStep();
    scheduleRolePlayback(delay);
  }

  function pauseRolePlayback() {
    clearRoleTimer();
    rolePlaying = false;
    rolePlayBtn.textContent = 'AUTO PLAY';
  }

  function openRole(key) {
    const role = roles[key];
    if (!role) return;
    clearRoleTimer();
    clearActivityTransfer();
    activeRoleKey = key;
    roleStep = 0;
    rolePlaying = !reducedMotion;
    modal.querySelector('.role-index').textContent = role.index;
    modal.querySelector('.role-copy h2').textContent = role.title;
    modal.querySelector('.role-mission').textContent = role.mission;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    renderRoleStep();
    closeBtn.focus();
    if (rolePlaying) scheduleRolePlayback();
  }

  function closeRole() {
    clearRoleTimer();
    clearActivityTransfer();
    rolePlaying = false;
    activeRoleKey = null;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function advanceRoleStep() {
    if (!activeRoleKey) return;
    clearRoleTimer();
    rolePlaying = false;
    const lastStep = roles[activeRoleKey].steps.length - 1;
    roleStep = roleStep >= lastStep ? 0 : roleStep + 1;
    renderRoleStep();
  }

  function reverseRoleStep() {
    if (!activeRoleKey || roleStep === 0) return;
    clearRoleTimer();
    rolePlaying = false;
    roleStep -= 1;
    renderRoleStep();
  }

  function toggleRolePlayback() {
    if (rolePlaying) pauseRolePlayback();
    else startRolePlayback(roleStep === roles[activeRoleKey].steps.length - 1);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  document.querySelectorAll('.role-card').forEach(card => card.addEventListener('click', () => openRole(card.dataset.role)));
  closeBtn.addEventListener('click', closeRole);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeRole();
  });
  rolePrevBtn.addEventListener('click', reverseRoleStep);
  rolePlayBtn.addEventListener('click', toggleRolePlayback);
  roleNextBtn.addEventListener('click', advanceRoleStep);
  processStepTabs.forEach(tab => tab.addEventListener('click', () => setProcessStep(tab.dataset.processStepTarget)));
  processNextBtn?.addEventListener('click', advanceProcessStep);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeRole();
      return;
    }
    if (modal.classList.contains('open')) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        advanceRoleStep();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        reverseRoleStep();
      }
      return;
    }
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      next();
    }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      prev();
    }
    if (event.key === 'Home') activate(0, -1);
    if (event.key === 'End') activate(slides.length - 1, 1);
    if (event.key.toLowerCase() === 'f') toggleFullscreen();
  });

  window.addEventListener('hashchange', () => {
    const requested = Number(location.hash.slice(1)) - 1;
    if (Number.isInteger(requested) && requested >= 0 && requested < slides.length && requested !== index) {
      activate(requested, requested > index ? 1 : -1);
    }
  });

  document.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', event => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 60) delta < 0 ? next() : prev();
  }, { passive: true });

  const hashIndex = Number(location.hash.slice(1)) - 1;
  index = Number.isInteger(hashIndex) && hashIndex >= 0 && hashIndex < slides.length ? hashIndex : 0;
  slides.forEach(slide => slide.classList.remove('active'));
  activate(index, 1);
})();
